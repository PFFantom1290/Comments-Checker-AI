const WINDOW_MS   = 10 * 60 * 1000; // 10-minute rolling window
const MAX_REQUESTS = 20;             // allowed per window per IP (abuse guard only;
                                     // per-user scans are already capped separately)

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSecs: number;
  remaining: number;
}

/** Periodically purge expired buckets to prevent unbounded memory growth. */
function evictExpired(): void {
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (now >= bucket.resetAt) store.delete(key);
  }
}

// Run GC every 500 requests (cheap amortised cost).
let _callCount = 0;

export function checkRateLimit(ip: string): RateLimitResult {
  if (++_callCount % 500 === 0) evictExpired();

  const now = Date.now();
  let bucket = store.get(ip);

  // Missing or expired bucket → fresh window
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 1, resetAt: now + WINDOW_MS };
    store.set(ip, bucket);
    return { allowed: true, retryAfterSecs: 0, remaining: MAX_REQUESTS - 1 };
  }

  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS) {
    const retryAfterSecs = Math.ceil((bucket.resetAt - now) / 1_000);
    return { allowed: false, retryAfterSecs, remaining: 0 };
  }

  return { allowed: true, retryAfterSecs: 0, remaining: MAX_REQUESTS - bucket.count };
}
