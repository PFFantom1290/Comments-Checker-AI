// One-time Paddle catalog setup.
//
//   npm run paddle:setup
//
// Creates one product + four one-time prices (matching SCAN_PACKAGES in
// lib/paddle.ts) in whichever environment NEXT_PUBLIC_PADDLE_ENV points to, then
// prints the PADDLE_PRICE_* lines to paste into .env.local. Run it ONCE per
// environment (sandbox, then again for production). Reads env via --env-file.

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

const PACKAGES = [
  { key: "STARTER", scans: 50, amount: "199" },
  { key: "PLUS", scans: 100, amount: "299" },
  { key: "PRO", scans: 250, amount: "599" },
  { key: "MAX", scans: 500, amount: "999" },
];

console.log(`Creating catalog in Paddle (${isProd ? "production" : "sandbox"})…`);

const product = await paddle.products.create({
  name: "Shopping Truth Filter — Scan packs",
  taxCategory: "standard",
  description: "Prepaid AI review-analysis scans.",
});
console.log("✓ product", product.id);

const lines = [];
for (const p of PACKAGES) {
  const price = await paddle.prices.create({
    productId: product.id,
    description: `${p.scans} scans`,
    unitPrice: { amount: p.amount, currencyCode: "USD" },
    // No billingCycle → one-time purchase.
  });
  console.log(`✓ price ${p.scans} scans ($${(Number(p.amount) / 100).toFixed(2)}) → ${price.id}`);
  lines.push(`PADDLE_PRICE_${p.key}=${price.id}`);
}

console.log("\n── Paste these into .env.local, then restart the dev server ──\n");
console.log(lines.join("\n"));
