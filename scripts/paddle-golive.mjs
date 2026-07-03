// One-command PRODUCTION Paddle setup — run this once your live Paddle account
// is approved:
//
//   npm run paddle:golive -- --key pdl_live_apikey_xxxxx
//
// Idempotent: safe to re-run — it reuses an existing "ReviewX — Subscriptions"
// product, its recurring prices, and the webhook destination instead of
// creating duplicates (the sandbox ended up with 3 duplicate products because
// paddle:setup had no such guard).
//
// It deliberately does NOT read .env.local: the live key is passed on the CLI
// so sandbox and production credentials never mix.

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const WEBHOOK_URL = "https://reviewx.tech/api/paddle/webhook";
const PRODUCT_NAME = "ReviewX — Subscriptions";

const PLANS = [
  { key: "BASIC", name: "Basic", scans: 50,  amount: "199" },
  { key: "PLUS",  name: "Plus",  scans: 100, amount: "299" },
  { key: "PRO",   name: "Pro",   scans: 250, amount: "599" },
  { key: "ULTRA", name: "Ultra", scans: 500, amount: "999" },
];

// ── CLI / safety checks ──────────────────────────────────────────────────────
const keyIdx = process.argv.indexOf("--key");
const key = keyIdx !== -1 ? process.argv[keyIdx + 1] : null;
if (!key) {
  console.error("Usage: npm run paddle:golive -- --key <live API key>");
  console.error("Get it from the LIVE dashboard → Developer Tools → Authentication → API keys.");
  process.exit(1);
}
if (key.includes("sdbx")) {
  console.error("✗ That looks like a SANDBOX key (contains 'sdbx'). This script targets PRODUCTION only.");
  process.exit(1);
}

const paddle = new Paddle(key, { environment: Environment.production });

// ── 1. Product (reuse if it already exists) ──────────────────────────────────
let product = null;
for (const p of await paddle.products.list({ status: ["active"], perPage: 200 }).next()) {
  if (p.name === PRODUCT_NAME) { product = p; break; }
}
if (product) {
  console.log(`✓ product (existing) ${product.id}`);
} else {
  product = await paddle.products.create({
    name: PRODUCT_NAME,
    taxCategory: "standard",
    description: "ReviewX monthly plans for AI review analysis.",
  });
  console.log(`✓ product (created)  ${product.id}`);
}

// ── 2. Prices (reuse by description match, create the missing ones) ─────────
const existingPrices = await paddle.prices
  .list({ productId: [product.id], status: ["active"], perPage: 200 })
  .next();

const priceLines = [];
for (const p of PLANS) {
  const description = `${p.name} — ${p.scans} scans / month`;
  let price = existingPrices.find(
    (x) => x.description === description && x.billingCycle?.interval === "month"
  );
  if (price) {
    console.log(`✓ ${p.name.padEnd(6)} (existing) ${price.id}`);
  } else {
    price = await paddle.prices.create({
      productId: product.id,
      description,
      unitPrice: { amount: p.amount, currencyCode: "USD" },
      billingCycle: { interval: "month", frequency: 1 },
    });
    console.log(`✓ ${p.name.padEnd(6)} (created)  $${(Number(p.amount) / 100).toFixed(2)}/mo → ${price.id}`);
  }
  priceLines.push(`PADDLE_PRICE_${p.key}=${price.id}`);
}

// ── 3. Webhook destination (reuse if one already points at our URL) ─────────
const settings = await paddle.notificationSettings.list();
let hook = settings.find((s) => s.destination === WEBHOOK_URL);
if (hook) {
  console.log(`✓ webhook (existing) ${hook.id} → ${hook.destination}`);
} else {
  hook = await paddle.notificationSettings.create({
    description: "ReviewX subscriptions",
    destination: WEBHOOK_URL,
    type: "url",
    subscribedEvents: [
      "subscription.activated",
      "subscription.updated",
      "subscription.resumed",
      "subscription.canceled",
    ],
  });
  console.log(`✓ webhook (created)  ${hook.id} → ${hook.destination}`);
}

// ── 4. Everything to paste into Vercel (Production environment) ─────────────
console.log(`
── Vercel → Settings → Environment Variables (Production) ──────────────────

NEXT_PUBLIC_PADDLE_ENV=production
PADDLE_API_KEY=${key}
PADDLE_WEBHOOK_SECRET=${hook.endpointSecretKey}
${priceLines.join("\n")}

NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=  ← create in LIVE dashboard → Developer Tools
                                    → Authentication → Client-side tokens

── Still needed in the LIVE dashboard (no API for these) ────────────────────
 1. Checkout → Website approval: make sure reviewx.tech is approved.
 2. Checkout → Checkout settings: set default payment link to
    https://reviewx.tech/billing
 3. After saving the env vars in Vercel: REDEPLOY, then make a small real
    purchase to verify, and refund it from Transactions if you like.
`);
