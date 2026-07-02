import OpenAI from "openai";

// Lazy singleton — avoids crashing the module at load time when the key is absent
let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    // Detailed hint goes to the server log only — the thrown message is
    // forwarded to the user's error card by the analyze route.
    console.error("[analyzer] OPENAI_API_KEY is not set — add it to .env.local / Vercel env.");
    throw new Error("The analysis service isn't available right now. Please try again later.");
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export interface Aspect {
  /** The product dimension reviewers discuss, e.g. "Battery life", "Sizing". */
  name: string;
  sentiment: "positive" | "negative" | "mixed";
  /** One-sentence summary of what reviewers say about this aspect. */
  detail: string;
}

export interface AnalysisResult {
  verdict: "BUY" | "DONT_BUY" | "MIXED";
  confidence: number; // 0–100
  /** AI's estimate of the true average rating implied by reviews (0–5), or null. */
  ratingEstimate: number | null;
  /** Share of reviews by tone — percentages, normalized for display. */
  sentiment: { positive: number; neutral: number; negative: number };
  pros: string[];
  cons: string[];
  /** Per-feature breakdown of what reviewers actually discuss. */
  aspects: Aspect[];
  /** Who / what use-cases the product suits. */
  bestFor: string[];
  /** Concrete deal-breakers, defects, or warnings. */
  watchOuts: string[];
  fakeReviewRisk: "low" | "medium" | "high";
  fakeReviewReason: string;
  summary: string;
  /** Longer, actionable recommendation paragraph. */
  bottomLine: string;
  reviewCount: number | null;
  productTitle: string;
}

// Assembled per-request so we can inject the language directive AT THE TOP of
// the system prompt — models obey system-level "write in Xxx" instructions far
// more reliably than the same instruction buried in the user message.
function buildSystemPrompt(language: string): string {
  const langLine =
    language && language !== "English"
      ? `LANGUAGE (MOST IMPORTANT RULE): Write every human-readable text VALUE — pros, cons, aspect "name", aspect "detail", bestFor, watchOuts, fakeReviewReason, summary, bottomLine — in ${language}. Do NOT use English for these values. Keep the JSON KEYS in English and keep the ENUM values ("verdict", "fakeReviewRisk", each aspect "sentiment") exactly as specified in English.\n\n`
      : "";

  return `${langLine}You are a brutally honest product-review analyst for "ReviewX".
Given raw customer-review text scraped from an e-commerce page, extract the real
signal from the noise and return a thorough, structured assessment.

Return ONLY a valid JSON object — no markdown fences, no commentary — with EXACTLY this shape:
{
  "verdict": "BUY" | "DONT_BUY" | "MIXED",
  "confidence": <integer 0-100, how clear-cut the verdict is>,
  "ratingEstimate": <number 0-5 with one decimal — your estimate of the true average rating implied by the reviews, or null if unknowable>,
  "sentiment": { "positive": <int>, "neutral": <int>, "negative": <int> },
  "pros": [<up to 6 concise strings, most impactful first>],
  "cons": [<up to 6 concise strings, most damaging first>],
  "aspects": [ { "name": "<feature dimension>", "sentiment": "positive"|"negative"|"mixed", "detail": "<one short sentence on what reviewers say>" } ],
  "bestFor": [<up to 4 short phrases: who or which use-case this product suits>],
  "watchOuts": [<up to 4 concrete deal-breakers, defects, or warnings buyers should know>],
  "fakeReviewRisk": "low" | "medium" | "high",
  "fakeReviewReason": "<one short sentence explaining the fake-review risk>",
  "summary": "<2-3 sentence verdict>",
  "bottomLine": "<3-4 sentence actionable recommendation: who should buy, who should skip, and why>"
}

Rules:
- Base EVERYTHING only on the review content. Ignore marketing copy, brand blurbs, ads, and unrelated "customers also bought" items.
- "sentiment" percentages should reflect the rough split of review tone and sum to ~100.
- BUY: pros clearly dominate and the product reliably delivers its core promise.
- DONT_BUY: cons reveal a defect, safety risk, or consistent failure of the core promise.
- MIXED: strong voices on both sides, or quality is inconsistent / situational.
- Keep each pro, con, and aspect "detail" under ~15 words.
- "aspects" must be the specific dimensions reviewers actually discuss — do not invent generic ones.
- "fakeReviewRisk": judge from repetitive/generic praise, suspiciously uniform 5-stars, incentivized-review mentions, or vague language.
- If there is too little review text to judge, set confidence 0, verdict "MIXED", ratingEstimate null, empty arrays, and explain in summary.`;
}

// ── Safe coercion helpers (the model can return anything) ────────────────────

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v)
    ? Math.min(max, Math.max(min, Math.round(v)))
    : fallback;
}

function strArray(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim())
    .slice(0, max);
}

function coerceAspects(v: unknown): Aspect[] {
  if (!Array.isArray(v)) return [];
  const out: Aspect[] = [];
  for (const item of v) {
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const name = typeof o.name === "string" ? o.name.trim() : "";
      if (!name) continue;
      const sentiment =
        o.sentiment === "positive" || o.sentiment === "negative" || o.sentiment === "mixed"
          ? o.sentiment
          : "mixed";
      const detail = typeof o.detail === "string" ? o.detail.trim() : "";
      out.push({ name, sentiment, detail });
      if (out.length >= 6) break;
    }
  }
  return out;
}

function coerceSentiment(v: unknown): AnalysisResult["sentiment"] {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    positive: clampInt(o.positive, 0, 100, 0),
    neutral: clampInt(o.neutral, 0, 100, 0),
    negative: clampInt(o.negative, 0, 100, 0),
  };
}

export async function analyzeReviews(
  reviewBlock: string,
  productTitle: string,
  reviewCount: number | null,
  language: string = "English"
): Promise<AnalysisResult> {
  const reminder =
    language && language !== "English"
      ? `\n\nReminder: write all text values in ${language}, not English.`
      : "";

  const userMessage = `Product: ${productTitle}
${reviewCount ? `Approximate review count on page: ${reviewCount}` : ""}

--- REVIEW CONTENT START ---
${reviewBlock}
--- REVIEW CONTENT END ---

Analyze the reviews above and return the JSON assessment.${reminder}`;

  const completion = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2, // low temp = consistent, factual extraction
    max_tokens: 1500, // room for the richer structured output
    messages: [
      { role: "system", content: buildSystemPrompt(language) },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" }, // forces valid JSON, no fences
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[analyzer] Malformed AI response:", raw.slice(0, 500));
    throw new Error("AI returned malformed JSON. Please try again.");
  }

  const VALID_VERDICTS = new Set<string>(["BUY", "DONT_BUY", "MIXED"]);
  const verdict = VALID_VERDICTS.has((parsed.verdict as string) ?? "")
    ? (parsed.verdict as AnalysisResult["verdict"])
    : "MIXED";

  const VALID_RISK = new Set<string>(["low", "medium", "high"]);
  const fakeReviewRisk = VALID_RISK.has((parsed.fakeReviewRisk as string) ?? "")
    ? (parsed.fakeReviewRisk as AnalysisResult["fakeReviewRisk"])
    : "low";

  const ratingEstimate =
    typeof parsed.ratingEstimate === "number" && Number.isFinite(parsed.ratingEstimate)
      ? Math.min(5, Math.max(0, Math.round(parsed.ratingEstimate * 10) / 10))
      : null;

  return {
    verdict,
    confidence: clampInt(parsed.confidence, 0, 100, 0),
    ratingEstimate,
    sentiment: coerceSentiment(parsed.sentiment),
    pros: strArray(parsed.pros, 6),
    cons: strArray(parsed.cons, 6),
    aspects: coerceAspects(parsed.aspects),
    bestFor: strArray(parsed.bestFor, 4),
    watchOuts: strArray(parsed.watchOuts, 4),
    fakeReviewRisk,
    fakeReviewReason:
      typeof parsed.fakeReviewReason === "string" && parsed.fakeReviewReason.trim()
        ? parsed.fakeReviewReason.trim()
        : "",
    summary:
      typeof parsed.summary === "string" && parsed.summary.length > 0
        ? parsed.summary
        : "Could not generate a summary.",
    bottomLine:
      typeof parsed.bottomLine === "string" && parsed.bottomLine.trim()
        ? parsed.bottomLine.trim()
        : "",
    reviewCount,
    productTitle,
  };
}
