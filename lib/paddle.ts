import { Paddle, Environment } from "@paddle/paddle-node-sdk";

// Lazy singleton so a missing key doesn't crash the module at import time.
let _paddle: Paddle | null = null;

/** Sandbox unless NEXT_PUBLIC_PADDLE_ENV is "production". Shared by client + server. */
export const paddleEnvironment =
  process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";

export function getPaddle(): Paddle {
  if (!process.env.PADDLE_API_KEY) {
    throw new Error(
      "PADDLE_API_KEY is not set. Add your Paddle API key to .env.local (see README → Payments)."
    );
  }
  if (!_paddle) {
    _paddle = new Paddle(process.env.PADDLE_API_KEY, {
      environment:
        paddleEnvironment === "production" ? Environment.production : Environment.sandbox,
    });
  }
  return _paddle;
}

export interface ScanPackage {
  id: string;
  scans: number;
  /** Display price in cents (USD) — must match the amount on the Paddle price. */
  priceCents: number;
  /** Paddle price id (pri_…), supplied per environment via env vars. */
  priceId: string;
  tag?: string;
}

// Prices live in Paddle (create them once — `npm run paddle:setup` does this and
// prints the ids). priceCents here is only for display; Paddle is the source of truth.
export const SCAN_PACKAGES: Record<string, ScanPackage> = {
  starter: { id: "starter", scans: 50, priceCents: 199, priceId: process.env.PADDLE_PRICE_STARTER ?? "" },
  plus: { id: "plus", scans: 100, priceCents: 299, priceId: process.env.PADDLE_PRICE_PLUS ?? "", tag: "Popular" },
  pro: { id: "pro", scans: 250, priceCents: 599, priceId: process.env.PADDLE_PRICE_PRO ?? "" },
  max: { id: "max", scans: 500, priceCents: 999, priceId: process.env.PADDLE_PRICE_MAX ?? "", tag: "Best value" },
};

export function getPackage(id: string): ScanPackage | null {
  return SCAN_PACKAGES[id] ?? null;
}

export function packageByPriceId(priceId: string): ScanPackage | null {
  return Object.values(SCAN_PACKAGES).find((p) => p.priceId && p.priceId === priceId) ?? null;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Minimal structural shape covering BOTH the API Transaction and the webhook
// TransactionNotification, so we don't have to reconcile their exact SDK types.
export interface PaddleTxnLike {
  id: string;
  status?: string;
  customData?: Record<string, unknown> | null;
  items?: Array<{ price?: { id?: string | null } | null; quantity?: number }> | null;
  details?: { totals?: { grandTotal?: string | null; total?: string | null } | null } | null;
}

/**
 * Pull the fields we need to credit scans out of a Paddle transaction. Prefers
 * the customData we set at checkout, falling back to the line-item price id.
 * Returns null if we can't tie it to an email + scan count.
 */
export function extractPurchase(txn: PaddleTxnLike): {
  sessionId: string;
  email: string;
  packageId: string;
  scans: number;
  amountCents: number;
} | null {
  const cd = (txn.customData ?? {}) as { email?: string; packageId?: string; scans?: string | number };
  const priceId = txn.items?.[0]?.price?.id ?? "";
  const pkg = (cd.packageId && getPackage(cd.packageId)) || packageByPriceId(priceId);

  const email = typeof cd.email === "string" ? cd.email : "";
  const scans = Number(cd.scans ?? pkg?.scans ?? 0);
  const packageId = cd.packageId ?? pkg?.id ?? "unknown";
  const amountCents = Number(
    txn.details?.totals?.grandTotal ?? txn.details?.totals?.total ?? pkg?.priceCents ?? 0
  );

  if (!email || !scans) return null;
  return { sessionId: txn.id, email, packageId, scans, amountCents };
}

/** A paid one-time transaction settles in one of these states. */
export function isPaidStatus(status: string | undefined): boolean {
  return status === "completed" || status === "paid" || status === "billed";
}
