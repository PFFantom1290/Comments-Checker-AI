// One-time Paddle catalog setup for the SUBSCRIPTION plans.
//
//   npm run paddle:setup
//
// Creates one product + four RECURRING monthly prices (Basic/Plus/Pro/Ultra,
// matching PLANS in lib/paddle.ts) in whichever environment
// NEXT_PUBLIC_PADDLE_ENV points to, then prints the PADDLE_PRICE_* lines to
// paste into .env.local. Run it ONCE per environment (sandbox, then production).

import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const key = process.env.PADDLE_API_KEY;
if (!key) {
  console.error("✗ PADDLE_API_KEY is not set. Add it to .env.local first.");
  process.exit(1);
}
const isProd = process.env.NEXT_PUBLIC_PADDLE_ENV === "production";
const paddle = new Paddle(key, {
  environment: isProd ? Environment.production : Environment.sandbox,
});

const PLANS = [
  { key: "BASIC", name: "Basic", scans: 50,  amount: "199" },
  { key: "PLUS",  name: "Plus",  scans: 100, amount: "299" },
  { key: "PRO",   name: "Pro",   scans: 250, amount: "599" },
  { key: "ULTRA", name: "Ultra", scans: 500, amount: "999" },
];

console.log(`Creating catalog in Paddle (${isProd ? "production" : "sandbox"})…`);

const product = await paddle.products.create({
  name: "Shopping Truth Filter — Subscriptions",
  taxCategory: "standard",
  description: "Monthly plans for AI review analysis.",
});
console.log("✓ product", product.id);

const lines = [];
for (const p of PLANS) {
  const price = await paddle.prices.create({
    productId: product.id,
    description: `${p.name} — ${p.scans} scans / month`,
    unitPrice: { amount: p.amount, currencyCode: "USD" },
    // billingCycle → recurring monthly. This is what makes it a subscription.
    billingCycle: { interval: "month", frequency: 1 },
  });
  console.log(`✓ ${p.name.padEnd(6)} $${(Number(p.amount) / 100).toFixed(2)}/mo (${p.scans} scans) → ${price.id}`);
  lines.push(`PADDLE_PRICE_${p.key}=${price.id}`);
}

console.log("\n── Paste these into .env.local (replacing the old one-time PADDLE_PRICE_* lines) ──\n");
console.log(lines.join("\n"));
console.log("\nThen restart the dev server. Old sandbox one-time prices are unused; you can delete them or leave them.\n");
