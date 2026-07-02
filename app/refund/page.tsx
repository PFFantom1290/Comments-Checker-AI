import Link from "next/link";

export const metadata = { title: "Refund Policy — ReviewX" };

const UPDATED = "1 July 2026";
const CONTACT = "ivanhavrylenko13@gmail.com";

export default function RefundPage() {
  return (
    <main className="min-h-screen text-gray-200 px-4 py-16">
      <article className="max-w-2xl mx-auto space-y-5 leading-relaxed text-sm">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Refund &amp; Cancellation Policy</h1>
        <p className="text-gray-500">Last updated: {UPDATED}</p>

        <p>
          ReviewX is offered as a monthly subscription. Each plan gives you a set number
          of AI review analyses (“scans”) per billing period. This policy explains how billing works,
          how to cancel, and when refunds are available.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">1. Subscriptions &amp; billing</h2>
        <p>
          Paid plans are billed <strong>monthly in advance</strong> through our Merchant of Record,{" "}
          <strong>Paddle.com</strong>. Each billing period grants your plan’s scan allowance. Unused
          scans <strong>do not roll over</strong> — they expire at the end of the period. Your
          subscription <strong>renews automatically</strong> each month at the then-current price
          until you cancel.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">2. Cancelling</h2>
        <p>
          You can cancel at any time from{" "}
          <Link href="/billing" className="text-indigo-400 hover:text-indigo-300">your account’s Billing page</Link>{" "}
          (“Manage or cancel subscription”), which opens Paddle’s secure customer portal. Cancellation
          stops future renewals. You keep access to your plan until the end of the period you have
          already paid for; we do not charge you again after that. We generally do not provide
          partial-month refunds for the current period, except as set out below.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">3. When we offer refunds</h2>
        <p>We will refund a payment if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>you were charged in error or charged more than once for the same period;</li>
          <li>a technical fault on our side prevented you from using the scans you paid for; or</li>
          <li>
            you request a refund of your <strong>first</strong> payment within <strong>14 days</strong>{" "}
            and have <strong>not run any scans</strong> in that period. Note that running an analysis
            begins the service and may end this cooling-off right.
          </li>
        </ul>
        <p>
          Automatic renewal charges are generally non-refundable once the new period has started,
          since cancelling before the renewal date prevents the charge. If you believe a renewal was
          charged in error, contact us. Statutory consumer rights (for example, under EU/UK law) are
          unaffected by this policy.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">4. How to request a refund</h2>
        <p>
          Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-indigo-400 hover:text-indigo-300">{CONTACT}</a>{" "}
          with the email used for the purchase and your order/receipt details. Because payments are
          handled by <strong>Paddle.com</strong>, approved refunds are issued through Paddle to your
          original payment method, usually within 5–10 business days.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">5. Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href={`mailto:${CONTACT}`} className="text-indigo-400 hover:text-indigo-300">{CONTACT}</a>.
        </p>
      </article>
    </main>
  );
}
