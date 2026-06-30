import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPaddle, extractPurchase, isPaidStatus, type PaddleTxnLike } from "@/lib/paddle";
import { recordAndCreditPurchase, getUserByEmail, availableScans } from "@/lib/users";
import { getI18n } from "@/lib/i18n.server";
import { fmt } from "@/lib/i18n";

function normalize(email: string) {
  return email.trim().toLowerCase();
}

// Paddle redirects here as /billing/success?_ptxn={transaction_id} after payment.
export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ _ptxn?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const { t } = await getI18n();
  const txnId = (await searchParams)._ptxn;
  let ok = false;
  let scans = 0;
  let balance: number | null = null;
  let error = "";

  if (!txnId) {
    error = "Missing transaction reference.";
  } else {
    try {
      const txn = (await getPaddle().transactions.get(txnId)) as unknown as PaddleTxnLike;
      const purchase = extractPurchase(txn);

      if (!isPaidStatus(txn.status)) {
        error = "Your payment hasn't completed yet. If you were charged, your scans will appear shortly.";
      } else if (!purchase) {
        error = "We couldn't read this purchase. If you were charged, your scans will be added.";
      } else if (normalize(purchase.email) !== normalize(session.user.email)) {
        error = "This receipt belongs to a different account.";
      } else {
        scans = purchase.scans;
        await recordAndCreditPurchase(purchase);
        const u = await getUserByEmail(purchase.email);
        balance = u ? availableScans(u) : null;
        ok = true;
      }
    } catch (e) {
      console.error("[billing/success] error:", e);
      error = "We couldn't verify your payment. If you were charged, your scans will still be added.";
    }
  }

  return (
    <main className="min-h-screen text-gray-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center animate-fade-up">
        {ok ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">{t.success.successTitle}</h1>
            <p className="text-gray-400">
              {fmt(t.success.added, { n: scans })}
              {balance != null && <> {fmt(t.success.youNow, { n: balance })}</>}
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
            {t.success.buyMore}
          </Link>
        </div>
      </div>
    </main>
  );
}
