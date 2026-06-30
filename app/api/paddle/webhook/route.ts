import { NextRequest, NextResponse } from "next/server";
import { getPaddle, extractPurchase, isPaidStatus, type PaddleTxnLike } from "@/lib/paddle";
import { recordAndCreditPurchase } from "@/lib/users";

// Paddle needs the raw body to verify the signature.
export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[paddle/webhook] PADDLE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("paddle-signature") ?? "";
  const rawBody = await req.text();

  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, secret, signature);
  } catch (err) {
    console.error("[paddle/webhook] signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!event) {
    return NextResponse.json({ error: "Unparseable event." }, { status: 400 });
  }

  // Credit scans once a one-time purchase settles.
  if (event.eventType === "transaction.completed") {
    const txn = event.data as unknown as PaddleTxnLike;
    if (isPaidStatus(txn.status)) {
      const purchase = extractPurchase(txn);
      if (purchase) {
        try {
          const result = await recordAndCreditPurchase(purchase);
          console.log(
            `[paddle/webhook] ${txn.id} ${result.credited ? `credited ${purchase.scans} → ${purchase.email}` : "already processed"}`
          );
        } catch (err) {
          // 500 makes Paddle retry — safe, fulfillment is idempotent.
          console.error("[paddle/webhook] fulfillment error:", err);
          return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
        }
      } else {
        console.warn(`[paddle/webhook] ${txn.id} missing email/scans in customData — skipped`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
