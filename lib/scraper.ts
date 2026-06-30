// Budget: Jina(20s) + ScraperAPI(30s) = 50s max, leaving ~10s for AI + overhead
// inside Vercel's 60s maxDuration. Jina handles most sites in <10s; the 20s ceiling
// gives a slow/throttled response room to land before we fall back to ScraperAPI.
const JINA_TIMEOUT_MS    = 20_000;
const SCRAPER_TIMEOUT_MS = 30_000;

const AMAZON_DOMAINS =
  /^(?:www\.)?amazon\.(com|co\.uk|de|fr|es|it|co\.jp|in|ca|com\.au|com\.br|com\.mx|nl|se|pl|sg|ae|sa)$/i;

// Sites whose slider/swipe CAPTCHA neither Jina nor ScraperAPI can get past.
// We fail these fast (with guidance) instead of burning the full ~50s budget.
const UNSUPPORTED_HOSTS = /(?:^|\.)(?:aliexpress|taobao|tmall|1688)\./i;

/**
 * All signals that indicate the site returned a bot-block page rather than
 * real product content.  Checked against BOTH the Jina response and the
 * ScraperAPI response so CAPTCHA pages never reach the AI.
 */
const BLOCK_SIGNALS = [
  // ── Standard CAPTCHAs ──────────────────────────────────────────────────
  "requiring captcha",
  "please complete the captcha",
  "click the button below to continue",
  "verify you are human",
  "please verify you are a human",
  "enable javascript and cookies",
  "please complete the security check",
  "robot or human",
  "i am not a robot",
  // ── Slider / swipe CAPTCHAs (AliExpress, Lazada, Shopee, Taobao) ──────
  "slide to verify",
  "please slide",
  "swipe to verify",
  "drag the slider",
  "sorry, we have detected unusual traffic",
  "detected unusual traffic",
  "unusual activity from your network",
  // ── Generic bot detection ──────────────────────────────────────────────
  "detected as a bot",
  "automated access",
  "your request has been blocked",
  "suspicious activity",
  // ── Cloudflare ────────────────────────────────────────────────────────
  "checking your browser",
  "cloudflare ray id",
  "just a moment...",
  // ── Amazon bot-block / CAPTCHA ─────────────────────────────────────────
  // NOTE: do NOT match generic "sign in" text here — every normal Amazon page
  // contains sign-in links and "sign in to continue", which previously caused
  // every legitimate Amazon page to be misflagged as a block.
  "type the characters you see in this image",
  "enter the characters you see below",
  "just need to make sure you're not a robot",
  "to discuss automated access to amazon data",
  "api-services-support@amazon.com",
  // ── Generic auth walls ────────────────────────────────────────────────
  "you must be logged in",
  "please log in to continue",
  "access denied",
];

export interface ScrapeResult {
  markdown: string;
  url: string;
}

/**
 * Normalize Amazon product URLs to their canonical `/dp/{ASIN}` form.
 *
 * We deliberately do NOT use the `/product-reviews/{ASIN}/` page: although it
 * shows more reviews in a browser, Amazon returns HTTP 404 for that bare path
 * when requested by a bot (no session cookies). The `/dp/{ASIN}` page returns
 * 200 and includes the inline "Top reviews" section — enough for a verdict.
 *
 * Normalizing also strips tracking params and slugs, which improves cache hits
 * and avoids ScraperAPI choking on giant ref-laden URLs.
 */
function resolveUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (AMAZON_DOMAINS.test(u.hostname)) {
      const asinMatch = u.pathname.match(
        /\/(?:dp|gp\/product|product-reviews)\/([A-Z0-9]{10})(?:[/?]|$)/i
      );
      if (asinMatch) {
        const asin = asinMatch[1].toUpperCase();
        return `https://${u.hostname}/dp/${asin}`;
      }
    }
  } catch { /* fall through */ }
  return raw;
}

function isBlockedPage(markdown: string): boolean {
  const lower = markdown.toLowerCase();
  return BLOCK_SIGNALS.some((s) => lower.includes(s));
}

// HTTP status codes from Jina that mean the URL itself is broken.
// For these, ScraperAPI won't help — throw immediately.
const FATAL_HTTP_CODES = new Set(["400", "404", "410", "451"]);

// Jina wraps HTTP error responses like:
//   "Warning: Target URL returned error 403: Forbidden"
// Returns { code, description } when detected, null otherwise.
function parseJinaHttpError(markdown: string): { code: string; description: string } | null {
  const match = markdown.match(/warning:\s*target url returned error (\d{3})([^\n]*)/i);
  if (!match) return null;
  return { code: match[1], description: match[1] + match[2].trim() };
}

/**
 * Convert raw HTML → readable plain text while preserving paragraph breaks.
 * Block-level elements get a newline before tag removal so content isn't merged.
 */
function htmlToMarkdown(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Insert newlines for block-level elements BEFORE stripping tags
    .replace(/<\/?(p|div|section|article|h[1-6]|li|tr|blockquote|br)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function abortError(msg: string): Error {
  const e = new Error(msg);
  e.name = "ScrapeError";
  return e;
}

/** Primary scraper — Jina AI Reader (free, no key required for basic use). */
async function scrapeViaJina(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const headers: HeadersInit = {
    Accept: "text/markdown",
    "X-Return-Format": "markdown",
    "X-Timeout": "15",
  };
  if (process.env.JINA_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.JINA_API_KEY}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), JINA_TIMEOUT_MS);
  try {
    const res = await fetch(jinaUrl, { headers, signal: controller.signal });
    if (!res.ok) throw abortError(`Jina returned ${res.status}: ${res.statusText}`);
    return await res.text();
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw abortError("Jina request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fallback scraper — ScraperAPI handles CAPTCHAs and residential IPs.
 * Free tier: 5,000 credits/month.  Sign up at https://www.scraperapi.com
 * Set SCRAPERAPI_KEY in .env.local to enable this fallback.
 */
async function scrapeViaScraperAPI(url: string): Promise<string> {
  const key = process.env.SCRAPERAPI_KEY;
  if (!key) {
    throw new Error(
      "This site requires bypassing bot-protection. " +
        "Add SCRAPERAPI_KEY to .env.local (free at scraperapi.com) to enable Amazon support."
    );
  }

  // wait=5000 gives the headless browser 5s after page load to finish AJAX calls.
  // Was 8000 — reduced because the extra 3s was pushing total time over 30s on
  // slow sites, causing consistent AbortController timeouts.
  const apiUrl =
    `https://api.scraperapi.com/?api_key=${key}` +
    `&url=${encodeURIComponent(url)}&render=true&wait=5000`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SCRAPER_TIMEOUT_MS);
  try {
    const res = await fetch(apiUrl, { signal: controller.signal });
    if (!res.ok) throw abortError(`ScraperAPI returned ${res.status}: ${res.statusText}`);
    const html = await res.text();
    return htmlToMarkdown(html);
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw abortError("ScraperAPI request timed out — site may be unreachable");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function scrapePage(url: string): Promise<ScrapeResult> {
  const resolvedUrl = resolveUrl(url);

  // ── Step 0: Fast-fail sites we know we can't scrape ───────────────────
  let host = "";
  try { host = new URL(url).hostname; } catch { /* validated upstream */ }
  if (UNSUPPORTED_HOSTS.test(host)) {
    throw new Error(
      "AliExpress and similar sites (Taobao, Tmall) use a slider CAPTCHA that blocks " +
        "automated review reading, so they can't be analyzed. Try Amazon, Rozetka, Comfy, " +
        "eBay, Best Buy, or Walmart instead."
    );
  }

  // ── Step 1: Try Jina (free, works for most sites) ─────────────────────
  let markdown: string;
  try {
    markdown = await scrapeViaJina(resolvedUrl);
  } catch (err) {
    console.warn("[scraper] Jina failed, trying ScraperAPI:", (err as Error).message);
    const fromScraper = await scrapeViaScraperAPI(resolvedUrl);
    if (isBlockedPage(fromScraper)) {
      throw new Error(
        "This site is blocking automated access. " +
          "Try a product from Amazon, eBay, Best Buy, or Walmart."
      );
    }
    if (fromScraper.length < 200) {
      throw new Error("Page returned too little content after both scrapers.");
    }
    return { markdown: fromScraper, url };
  }

  // ── Step 2: Detect Jina-wrapped HTTP errors (403, 404, 500, etc.) ────────
  // Jina returns HTTP 200 even when the *target* site refused the request, e.g.
  //   "Warning: Target URL returned error 403: Forbidden"   ← Amazon bot-block
  const jinaHttpError = parseJinaHttpError(markdown);
  if (jinaHttpError) {
    // Fatal codes mean the URL itself is broken — ScraperAPI can't help.
    if (FATAL_HTTP_CODES.has(jinaHttpError.code)) {
      throw new Error(
        `The product page returned an HTTP error: ${jinaHttpError.description}. ` +
          "Check the URL — the product may have been removed or the link may be invalid."
      );
    }
    // Non-fatal (403 / 429 / 5xx — e.g. Amazon refusing bots) → retry via
    // ScraperAPI, which uses a real browser + rotating IPs to get past the block.
    console.warn(`[scraper] Jina HTTP ${jinaHttpError.code}, retrying with ScraperAPI`);
    const fromScraper = await scrapeViaScraperAPI(resolvedUrl);
    if (isBlockedPage(fromScraper)) {
      throw new Error(
        "This site is blocking automated access. " +
          "Try a product from Amazon, eBay, Best Buy, or Walmart."
      );
    }
    if (fromScraper.length < 200) {
      throw new Error("Page returned too little content after both scrapers.");
    }
    return { markdown: fromScraper, url };
  }

  // ── Step 3: Check if Jina got a bot-block page ─────────────────────────
  if (isBlockedPage(markdown)) {
    console.warn("[scraper] Bot-block detected via Jina, retrying with ScraperAPI");
    const fromScraper = await scrapeViaScraperAPI(resolvedUrl);

    // ScraperAPI might ALSO be blocked (e.g. AliExpress slider CAPTCHA)
    if (isBlockedPage(fromScraper)) {
      throw new Error(
        "This site is blocking automated access with a CAPTCHA that cannot be bypassed. " +
          "AliExpress uses a slider CAPTCHA that requires human interaction. " +
          "Try a product from Amazon, eBay, Best Buy, or Walmart instead."
      );
    }
    if (fromScraper.length < 200) {
      throw new Error("Page returned too little content — site may be bot-protected.");
    }
    return { markdown: fromScraper, url };
  }

  if (!markdown || markdown.length < 200) {
    throw new Error("Page returned too little content — the site may be unavailable.");
  }

  return { markdown, url };
}
