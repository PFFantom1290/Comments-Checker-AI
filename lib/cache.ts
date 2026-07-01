import type { AnalysisResult } from "@/lib/analyzer";
import { Redis } from "@upstash/redis";

// ─────────────────────────────────────────────────────────────────────────────
// Analysis cache. Re-checking an already-analyzed product is free (doesn't burn
// a scan), so the cache also protects us from paying OpenAI twice for the same
// URL.
//
// On Vercel every request may hit a fresh serverless instance, so an in-process
// Map barely ever hits. When Upstash Redis is configured we use it (shared
// across all instances); otherwise we fall back to an in-memory Map so local
// dev and any missing-env deploy still work — just per-process.
// ─────────────────────────────────────────────────────────────────────────────

const TTL_SECONDS = 24 * 60 * 60; // 24 hours
const TTL_MS = TTL_SECONDS * 1000;
const MAX_SIZE = 1_000; // in-memory fallback cap only

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const TRACKING_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gad_campaignid", "gclid", "fbclid", "ref", "th", "psc",
  "tag", "linkCode", "linkId", "camp", "creative",
];

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    TRACKING_PARAMS.forEach((p) => u.searchParams.delete(p));
    u.searchParams.sort();
    return (u.origin + u.pathname + (u.search || "")).toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

// `variant` keeps localized results separate — the same product analyzed in
// English and Spanish are different cache entries.
function keyFor(url: string, variant: string): string {
  return `review:${normalizeUrl(url)}|${variant}`;
}

// ── In-memory fallback (no Redis configured) ─────────────────────────────────
interface Entry {
  result: AnalysisResult;
  cachedAt: number;
}
const mem = new Map<string, Entry>();

function memGet(key: string): AnalysisResult | null {
  const entry = mem.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > TTL_MS) {
    mem.delete(key);
    return null;
  }
  return entry.result;
}

function memSet(key: string, result: AnalysisResult): void {
  if (mem.size >= MAX_SIZE) {
    // Drop expired entries first, then the oldest if still at capacity.
    const now = Date.now();
    for (const [k, e] of mem) if (now - e.cachedAt > TTL_MS) mem.delete(k);
    if (mem.size >= MAX_SIZE) {
      const oldest = mem.keys().next().value;
      if (oldest !== undefined) mem.delete(oldest);
    }
  }
  mem.set(key, { result, cachedAt: Date.now() });
}

// ── Public API (async — Redis calls are over HTTP) ───────────────────────────
export async function getCached(url: string, variant = ""): Promise<AnalysisResult | null> {
  const key = keyFor(url, variant);
  if (redis) {
    try {
      // @upstash/redis serializes objects to JSON and parses them back on read.
      return (await redis.get<AnalysisResult>(key)) ?? null;
    } catch (err) {
      // A Redis hiccup should degrade to a cache miss, never break analysis.
      console.error("[cache] redis get failed:", (err as Error).message);
      return null;
    }
  }
  return memGet(key);
}

export async function setCached(url: string, result: AnalysisResult, variant = ""): Promise<void> {
  const key = keyFor(url, variant);
  if (redis) {
    try {
      await redis.set(key, result, { ex: TTL_SECONDS });
      return;
    } catch (err) {
      console.error("[cache] redis set failed:", (err as Error).message);
      return;
    }
  }
  memSet(key, result);
}
