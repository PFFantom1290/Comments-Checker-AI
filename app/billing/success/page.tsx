import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getPaddle,
  extractSubscription,
  isActiveSubStatus,
  type PaddleSubLike,
} from "@/lib/paddle";
import { activateSubscription, getUserByEmail, availableScans } from "@/lib/users";
import { getI18n } from "@/lib/i18n.server";
import { fmt } from "@/lib/i18n";

function normalize(email: string) {
  return email.trim().toLowerCase();
}

function readSubId(txn: unknown): string | null {
  const t = txn as { subscriptionId?: string | null; subscription_id?: string | null };
  return t.subscriptionId ?? t.subscription_id ?? null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Paddle provisions the subscription ~10s AFTER billing the transaction, so we
// may need to wait for the transaction→subscription link. Give the function
// room to poll (Vercel caps server work; default is too short for this wait).
export const maxDuration = 30;

// Paddle redirects here as /billing/success?_ptxn={transaction_id} after payment.
// We look up the transaction, follow it to the subscription it created, and
// activate the user's plan as a fallback in case the webhook is delayed.
export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ _ptxn?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const { t, locale } = await getI18n();
  const txnId = (await searchParams)._ptxn;
  let ok = false;
  let planName = "";
  let scans = 0;
  let balance: number | null = null;
  let periodEnd: string | null = null;
  let error = "";

  if (!txnId) {
    error = "Missing transaction reference.";
  } else {
    try {
      const paddle = getPaddle();
      // Follow txn → subscription. Subscriptions carry the recurring plan info.
      // For a recurring price Paddle bills the transaction first and links the
      // subscription a moment later, so subscription_id can still be null right
      // after checkout.completed. Retry briefly to let Paddle catch up.
      // Paddle's provisioning gap is ~10s in practice; poll a bit past that.
      let subId = readSubId(await paddle.transactions.get(txnId));
      for (let i = 0; i < 15 && !subId; i++) {
        await sleep(1200);
        subId = readSubId(await paddle.transactions.get(txnId));
      }

      if (!subId) {
        // Recurring purchase, but the subscription hasn't been provisioned yet.
        // Not an error — the webhook activates it. Show a pending message.
        error = "Your subscription is being set up. If you were charged, it will activate in a moment — refresh this page shortly.";
      } else {
        const sub = (await paddle.subscriptions.get(subId)) as unknown as PaddleSubLike;
        const info = extractSubscription(sub);

        if (!info) {
          error = "We couldn't read your subscription. If you were charged, it will still take effect shortly.";
        } else if (normalize(info.email) !== normalize(session.user.email)) {
          error = "This receipt belongs to a different account.";
        } else if (!isActiveSubStatus(info.status)) {
          error = "Your subscription hasn't activated yet. If you were charged, it will appear shortly.";
        } else {
          await activateSubscription({
            email: info.email,
            subscriptionId: info.subscriptionId,
            plan: info.plan.id,
            scansLimit: info.plan.scans,
            periodEnd: info.periodEnd,
          });
          planName = info.plan.name;
          scans = info.plan.scans;
          periodEnd = info.periodEnd.toISOString();
          const u = await getUserByEmail(info.email);
          balance = u ? availableScans(u) : null;
          ok = true;
        }
      }
    } catch (e) {
      console.error("[billing/success] error:", e);
      error = "We couldn't verify your subscription. If you were charged, it will still take effect.";
    }
  }

  const readableEnd = periodEnd
    ? new Date(periodEnd).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <main className="min-h-screen text-gray-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center animate-fade-up">
        {ok ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">{t.success.subActiveTitle}</h1>
            <p className="text-gray-400">
              {fmt(t.success.subActiveBody, { plan: planName, scans })}
              {balance != null && (
                <>
                  {" "}
                  {fmt(t.success.youNow, { n: balance })}
                </>
              )}
              {readableEnd && (
                <>
                  <br />
                  <span className="text-gray-500 text-sm">
                    {fmt(t.success.renewsOn, { date: readableEnd })}
                  </span>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-2">{t.success.almost}</h1>
            <p className="text-gray-400">{error}</p>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-5 py-2.5 transition-colors"
          >
            {t.success.start}
          </Link>
          <Link href="/billing" className="text-sm text-indigo-400 hover:text-indigo-300">
            {t.success.manage}
          </Link>
        </div>
      </div>
    </main>
  );
}
