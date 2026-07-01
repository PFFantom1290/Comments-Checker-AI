import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPaddle } from "@/lib/paddle";
import { getUserByEmail } from "@/lib/users";

// Sends the signed-in user to Paddle's hosted customer portal, where they can
// cancel, update their card, and view invoices. We create a fresh, short-lived
// portal session on each click (Paddle requires the customer id + their sub id),
// then 302 to the portal overview. Cancellations come back to us via the
// subscription.canceled webhook.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await getUserByEmail(session.user.email);
  // No subscription on file (e.g. free tier or legacy-credit only) — nothing to
  // manage; send them back to the plans page.
  if (!user?.subscriptionId) {
    return NextResponse.redirect(new URL("/billing", req.url));
  }

  try {
    const paddle = getPaddle();
    // The portal session needs the Paddle customer id, which we don't store —
    // read it off the subscription.
    const sub = await paddle.subscriptions.get(user.subscriptionId);
    const customerId = (sub as unknown as { customerId?: string | null }).customerId ?? "";
    if (!customerId) {
      return NextResponse.redirect(new URL("/billing?portal=error", req.url));
    }
    const portalSession = await paddle.customerPortalSessions.create(customerId, [
      user.subscriptionId,
    ]);
    return NextResponse.redirect(portalSession.urls.general.overview);
  } catch (e) {
    console.error("[paddle/portal] failed to open portal:", e);
    return NextResponse.redirect(new URL("/billing?portal=error", req.url));
  }
}
