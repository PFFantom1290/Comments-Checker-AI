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

export type PlanId = "basic" | "plus" | "pro" | "ultra";

export interface Plan {
  id: PlanId;
  /** Marketing name shown to users. */
  name: string;
  /** Monthly scan allowance — resets each billing cycle, unused scans expire. */
  scans: number;
  /** Display price in cents/month (USD). Must match the amount on the Paddle price. */
  priceCents: number;
  /** Paddle price id (pri_…), created by `npm run paddle:setup` and set per env. */
  priceId: string;
  tag?: string;
}

// Prices live in Paddle as RECURRING monthly prices (created by paddle:setup).
// priceCents here is only for display; Paddle is the source of truth for money.
export const PLANS: Record<PlanId, Plan> = {
  basic: { id: "basic", name: "Basic", scans: 50,  priceCents: 199, priceId: process.env.PADDLE_PRICE_BASIC ?? "" },
  plus:  { id: "plus",  name: "Plus",  scans: 100, priceCents: 299, priceId: process.env.PADDLE_PRICE_PLUS  ?? "", tag: "Popular" },
  pro:   { id: "pro",   name: "Pro",   scans: 250, priceCents: 599, priceId: process.env.PADDLE_PRICE_PRO   ?? "" },
  ultra: { id: "ultra", name: "Ultra", scans: 500, priceCents: 999, priceId: process.env.PADDLE_PRICE_ULTRA ?? "", tag: "Best value" },
};

export function getPlan(id: string): Plan | null {
  return (PLANS as Record<string, Plan>)[id] ?? null;
}

export function planByPriceId(priceId: string): Plan | null {
  return Object.values(PLANS).find((p) => p.priceId && p.priceId === priceId) ?? null;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Minimal structural shape covering BOTH the API Subscription and the webhook
// SubscriptionNotification, so we don't have to reconcile their exact SDK types.
export interface PaddleSubLike {
  id: string;
  status?: string;
  customData?: Record<string, unknown> | null;
  customerId?: string | null;
  items?: Array<{ price?: { id?: string | null } | null; quantity?: number }> | null;
  currentBillingPeriod?: { startsAt?: string | null; endsAt?: string | null } | null;
  nextBilledAt?: string | null;
  canceledAt?: string | null;
  scheduledChange?: { action?: string | null; effectiveAt?: string | null } | null;
}

/**
 * Extract subscription details we need to activate/renew a user's plan.
 * customData is populated by the checkout call so we can tie the sub to a user.
 * Falls back to the line-item price id to identify the plan.
 */
export function extractSubscription(sub: PaddleSubLike): {
  subscriptionId: string;
  email: string;
  plan: Plan;
  periodEnd: Date;
  status: string;
  cancelScheduled: boolean;
} | null {
  const cd = (sub.customData ?? {}) as { email?: string; planId?: string };
  const priceId = sub.items?.[0]?.price?.id ?? "";
  const plan = (cd.planId && getPlan(cd.planId)) || planByPriceId(priceId);
  const email = typeof cd.email === "string" ? cd.email : "";
  if (!plan || !email) return null;

  const endsAt =
    sub.currentBillingPeriod?.endsAt ??
    sub.nextBilledAt ??
    sub.scheduledChange?.effectiveAt ??
    null;
  if (!endsAt) return null;

  const cancelScheduled =
    !!sub.canceledAt || sub.scheduledChange?.action === "cancel" || sub.status === "canceled";

  return {
    subscriptionId: sub.id,
    email,
    plan,
    periodEnd: new Date(endsAt),
    status: sub.status ?? "",
    cancelScheduled,
  };
}

/** Subscription statuses that give the user access to their plan. */
export function isActiveSubStatus(status: string | undefined): boolean {
  // "past_due" still counts — Paddle retries billing; we honor the paid period.
  return status === "active" || status === "trialing" || status === "past_due";
}
