// Diagnostic: verify the configured PADDLE_PRICE_* ids are RECURRING prices.
//
//   npm run paddle:check
//
// Fetches each price id from your .env.local out of Paddle (in whichever env
// NEXT_PUBLIC_PADDLE_ENV points to) and reports its billing cycle. A one-time
// price has no billingCycle → checkout produces a transaction with no
// subscription, which is what causes "This purchase isn't tied to a
// subscription" on /billing/success.

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const key = process.env.PADDLE_API_KEY;
if (!key) {
  console.error("✗ PADDLE_API_KEY is not set in .env.local.");
  process.exit(1);
}
const isProd = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
const paddle = new Paddle(key, {
  environment: isProd ? Environment.production : Environment.sandbox,
});

const IDS = {
  BASIC: process.env.PADDLE_PRICE_BASIC,
  PLUS: process.env.PADDLE_PRICE_PLUS,
  PRO: process.env.PADDLE_PRICE_PRO,
  ULTRA: process.env.PADDLE_PRICE_ULTRA,
};

console.log(`Checking prices in Paddle (${isProd ? "production" : "sandbox"})…\n`);

let anyOneTime = false;
for (const [name, id] of Object.entries(IDS)) {
  if (!id) {
    console.log(`✗ ${name.padEnd(6)} — not set`);
    anyOneTime = true;
    continue;
  }
  try {
    const price = await paddle.prices.get(id);
    const cycle = price.billingCycle;
    if (cycle) {
      console.log(`✓ ${name.padEnd(6)} ${id} — RECURRING every ${cycle.frequency} ${cycle.interval}(s), status=${price.status}`);
    } else {
      console.log(`✗ ${name.padEnd(6)} ${id} — ONE-TIME (no billing cycle) ← this one is broken`);
      anyOneTime = true;
    }
  } catch (e) {
    console.log(`✗ ${name.padEnd(6)} ${id} — could not fetch: ${e.message}`);
    anyOneTime = true;
  }
}

if (anyOneTime) {
  console.log(
    `\n→ At least one price is one-time / missing. Run 'npm run paddle:setup' for THIS env,\n` +
      `  then paste the new PADDLE_PRICE_* ids into Vercel (Production) and redeploy.\n`
  );
  process.exit(1);
} else {
  console.log(`\n✓ All four prices are recurring. Checkout should create subscriptions.\n`);
}
