import type { AnalysisResult } from "@/lib/analyzer";

const TTL_MS    = 24 * 60 * 60 * 1000; // 24 hours
const MAX_SIZE  = 1_000;

interface Entry {
  result: AnalysisResult;
  cachedAt: number;
}

const store = new Map<string, Entry>();

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

/** Remove all expired entries to prevent stale results and unbounded memory growth. */
function evictExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.cachedAt > TTL_MS) {
      store.delete(key);
    }
  }
}

// `variant` keeps localized results separate — the same product analyzed in
// English and Spanish are different cache entries.
export function getCached(url: string, variant = ""): AnalysisResult | null {
  const key = `${normalizeUrl(url)}|${variant}`;
  const entry = store.get(key);
  if (!entry) return null;
  // Expired — delete immediately
  if (Date.now() - entry.cachedAt > TTL_MS) {
    store.delete(key);
    return null;
  }
  return entry.result;
}

export function setCached(url: string, result: AnalysisResult, variant = ""): void {
  const key = `${normalizeUrl(url)}|${variant}`;

  // Purge expired entries before checking size so we don't evict live entries
  // unnecessarily under normal traffic.
  if (store.size >= MAX_SIZE) {
    evictExpired();
  }

  // If still at capacity after GC, remove the oldest insertion-order entry.
  if (store.size >= MAX_SIZE) {
    const oldestKey = store.keys().next().value;
    if (oldestKey !== undefined) store.delete(oldestKey);
  }

  store.set(key, { result, cachedAt: Date.now() });
}
