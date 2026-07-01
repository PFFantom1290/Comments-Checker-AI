import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─────────────────────────────────────────────────────────────────────────────
// Per-IP abuse guard for the analyze endpoint (per-user scans are capped
// separately in the DB, so this only stops raw request floods).
//
// On Vercel each instance had its own Map, so the limit was really "20 per
// instance" — weak. When Upstash Redis is configured we use a shared sliding
// window across all instances; otherwise we fall back to the in-memory window
// so local dev still works.
// ─────────────────────────────────────────────────────────────────────────────

const WINDOW_MS = 10 * 60 * 1000; // 10-minute window
const MAX_REQUESTS = 20; // per window per IP

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSecs: number;
  remaining: number;
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "10 m"),
      prefix: "rl:analyze",
      analytics: false,
    })
  : null;

// ── In-memory fallback (no Redis configured) ─────────────────────────────────
interface Bucket {
  count: number;
  resetAt: number;
}
const store = new Map<string, Bucket>();
let _callCount = 0;

function memCheck(ip: string): RateLimitResult {
  // Cheap amortised GC of expired buckets.
  if (++_callCount % 500 === 0) {
    const now = Date.now();
    for (const [key, b] of store) if (now >= b.resetAt) store.delete(key);
  }

  const now = Date.now();
  const bucket = store.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSecs: 0, remaining: MAX_REQUESTS - 1 };
  }

  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS) {
    return { allowed: false, retryAfterSecs: Math.ceil((bucket.resetAt - now) / 1_000), remaining: 0 };
  }
  return { allowed: true, retryAfterSecs: 0, remaining: MAX_REQUESTS - bucket.count };
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (ratelimit) {
    try {
      const { success, remaining, reset } = await ratelimit.limit(ip);
      return {
        allowed: success,
        remaining,
        // `reset` is an epoch-ms timestamp for when the window frees up.
        retryAfterSecs: success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1_000)),
      };
    } catch (err) {
      // Fail OPEN: a Redis outage shouldn't lock everyone out — per-user scan
      // quotas still protect us from real overuse.
      console.error("[rateLimiter] redis limit failed, allowing:", (err as Error).message);
      return { allowed: true, retryAfterSecs: 0, remaining: -1 };
    }
  }
  return memCheck(ip);
}
