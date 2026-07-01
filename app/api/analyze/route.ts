import { NextRequest, NextResponse } from "next/server";
import { scrapePage } from "@/lib/scraper";
import { extractReviews } from "@/lib/textProcessor";
import { analyzeReviews } from "@/lib/analyzer";
import { getCached, setCached } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateLimiter";
import { auth } from "@/auth";
import { consumeScan, getUserByEmail, availableScans, isAdminEmail } from "@/lib/users";
import { isLocale, aiLanguageName, defaultLocale } from "@/lib/i18n";

// Vercel hobby plan max is 60s.  Our scraper chain is capped at 40s (18+22),
// leaving ~20s buffer for text processing + AI + cold-start overhead.
export const maxDuration = 60;

function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeHomepage(raw: string): boolean {
  try {
    const u = new URL(raw);
    const path = u.pathname.replace(/\/$/, "");
    if (path === "" || path === "/") return true;
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0].length < 4 && !/\d/.test(segments[0])) return true;
    return false;
  } catch {
    return false;
  }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function jsonError(message: string, status: number, extra?: Record<string, string>) {
  return NextResponse.json({ error: message }, { status, headers: extra });
}

export async function POST(req: NextRequest) {
  // ── Authentication gate ────────────────────────────────────────────────────
  // Only signed-in users may analyze; each gets a limited number of free scans.
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return jsonError("Please sign in to analyze a product.", 401);
  }
  const user = await getUserByEmail(email);
  if (!user) {
    // Session exists but the account record is gone (store reset, etc.).
    return jsonError("Your account could not be found. Please sign in again.", 401);
  }
  // Admins get unlimited scans (configured via ADMIN_EMAILS).
  const admin = isAdminEmail(email);
  const scanHeader = () => ({
    "X-Scans-Remaining": admin ? "unlimited" : String(availableScans(user)),
  });

  // Locale drives the AI output language and partitions the cache by language.
  const localeCookie = req.cookies.get("locale")?.value;
  const language = aiLanguageName[isLocale(localeCookie) ? localeCookie : defaultLocale];

  // ── Rate limiting ────────────────────────────────────────────────────────
  // Admins bypass the per-IP request limiter entirely — they have unlimited
  // scans, so throttling them to 5/10min made no sense.
  const ip = getClientIp(req);
  const { allowed, retryAfterSecs, remaining } = admin
    ? { allowed: true, retryAfterSecs: 0, remaining: -1 }
    : await checkRateLimit(ip);

  const rlHeaders = {
    "X-RateLimit-Remaining": admin ? "unlimited" : String(remaining),
    "X-RateLimit-Limit": admin ? "unlimited" : "20",
    "X-RateLimit-Window": "600",
  };

  if (!allowed) {
    return jsonError(
      `Rate limit reached. Please wait ${retryAfterSecs} seconds before trying again.`,
      429,
      { ...rlHeaders, "Retry-After": String(retryAfterSecs) }
    );
  }

  // ── Parse + validate body ────────────────────────────────────────────────
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const url = (body.url ?? "").trim();
  if (!url || !isValidUrl(url)) {
    return jsonError("Please provide a valid product URL.", 400);
  }
  if (looksLikeHomepage(url)) {
    return jsonError(
      "That looks like a homepage, not a product page. " +
        "Navigate to a specific product and copy its URL from the address bar.",
      400
    );
  }

  // ── Cache lookup ─────────────────────────────────────────────────────────
  // Cache hits are free — re-checking an already-analyzed product doesn't burn
  // one of the user's scans.
  const cached = await getCached(url, language);
  if (cached) {
    console.log(`[analyze] cache HIT — ${url}`);
    return NextResponse.json(cached, {
      headers: { ...rlHeaders, ...scanHeader(), "X-Cache": "HIT" },
    });
  }

  // ── Scan quota ─────────────────────────────────────────────────────────────
  // A fresh analysis costs one scan (free first, then purchased credits).
  // Admins skip the limit entirely.
  if (!admin && availableScans(user) <= 0) {
    return jsonError(
      "You're out of scans. Visit the Buy scans page to top up — packages start at $1.99.",
      403,
      { ...rlHeaders, ...scanHeader() }
    );
  }

  // ── Full pipeline ────────────────────────────────────────────────────────
  try {
    const { markdown } = await scrapePage(url);
    const { reviewBlock, productTitle, reviewCount } = extractReviews(markdown);

    console.log(
      `[analyze] MISS title="${productTitle}" reviews=${reviewCount} chars=${reviewBlock.length}`
    );
    console.log(`[analyze] preview: ${reviewBlock.slice(0, 300).replace(/\n/g, " ")}`);

    const result = await analyzeReviews(reviewBlock, productTitle, reviewCount, language);
    await setCached(url, result, language);

    // Only consume a scan once we have a real result to show for it.
    // Admins have unlimited scans, so they're never charged.
    const remainingHeader = admin
      ? "unlimited"
      : String(Math.max(0, await consumeScan(email)));

    return NextResponse.json(result, {
      headers: {
        ...rlHeaders,
        "X-Scans-Remaining": remainingHeader,
        "X-Cache": "MISS",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[analyze] error:", message);
    // Failed analysis doesn't cost a scan — return the unchanged remaining count.
    return NextResponse.json({ error: message }, {
      status: 500,
      headers: { ...rlHeaders, ...scanHeader() },
    });
  }
}
