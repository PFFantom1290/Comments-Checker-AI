import { NextRequest, NextResponse } from "next/server";
import { getPaddle, extractSubscription, isActiveSubStatus, type PaddleSubLike } from "@/lib/paddle";
import { activateSubscription, noteSubscriptionCanceled } from "@/lib/users";

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

  try {
    switch (event.eventType) {
      // Fires on: initial checkout, plan change, and each monthly renewal. On
      // every one we (re)activate — activateSubscription is idempotent and only
      // resets the monthly counter when the billing period actually rolled over.
      case "subscription.activated":
      case "subscription.updated":
      case "subscription.resumed": {
        const sub = event.data as unknown as PaddleSubLike;
        const info = extractSubscription(sub);
        if (info && isActiveSubStatus(info.status)) {
          await activateSubscription({
            email: info.email,
            subscriptionId: info.subscriptionId,
            plan: info.plan.id,
            scansLimit: info.plan.scans,
            periodEnd: info.periodEnd,
          });
          console.log(
            `[paddle/webhook] ${event.eventType} ${info.subscriptionId} → ${info.email} on ${info.plan.id} until ${info.periodEnd.toISOString()}`
          );
        } else if (info) {
          console.log(`[paddle/webhook] ${event.eventType} ignored (status=${info.status})`);
        } else {
          console.warn(`[paddle/webhook] ${event.eventType} missing email/plan — skipped`);
        }
        break;
      }

      // Fired when the user cancels. Paddle keeps them on plan until the paid
      // period ends; our isPlanActive() lazy-check handles that automatically.
      case "subscription.canceled": {
        const sub = event.data as unknown as PaddleSubLike;
        const info = extractSubscription(sub);
        if (info) {
          await noteSubscriptionCanceled(info.email, info.subscriptionId);
          console.log(`[paddle/webhook] canceled ${info.subscriptionId} for ${info.email} — access until ${info.periodEnd.toISOString()}`);
        }
        break;
      }

      default:
        // Silently ignore other events (transaction.*, address.*, adjustment.*)
        // — subscriptions are our only source of truth for plan state.
        break;
    }
  } catch (err) {
    // 500 makes Paddle retry — activateSubscription is idempotent so retries are safe.
    console.error("[paddle/webhook] handler error:", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
