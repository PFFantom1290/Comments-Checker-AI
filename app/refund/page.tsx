import Link from "next/link";

export const metadata = { title: "Refund Policy — Shopping Truth Filter" };

const UPDATED = "30 June 2026";
const CONTACT = "ivanhavrylenko13@gmail.com";

export default function RefundPage() {
  return (
    <main className="min-h-screen text-gray-200 px-4 py-16">
      <article className="max-w-2xl mx-auto space-y-5 leading-relaxed text-sm">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
        <p className="text-gray-500">Last updated: {UPDATED}</p>

        <p>
          Shopping Truth Filter sells digital scan credits that can be used immediately after
          purchase. This policy explains when refunds are available.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">1. Digital goods</h2>
        <p>
          Scan packs are digital products delivered to your account instantly. Because credits can be
          used right away, purchases are generally final once credits have been used.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">2. When we offer refunds</h2>
        <p>We will refund your purchase if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>you were charged in error or charged more than once for the same order;</li>
          <li>a technical fault on our side prevented your purchased credits from being added; or</li>
          <li>you request a refund within <strong>14 days</strong> of purchase and have <strong>not used any</strong> of the purchased credits.</li>
        </ul>
        <p>
          Partially used packs may be refunded on a pro-rata basis for the unused credits at our
          discretion. Statutory consumer rights (for example, under EU/UK law) are unaffected by this
          policy.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">3. How to request a refund</h2>
        <p>
          Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-indigo-400 hover:text-indigo-300">{CONTACT}</a>{" "}
          with the email used for the purchase and your order/receipt details. Payments are handled by
          our Merchant of Record, <strong>Paddle.com</strong>, so approved refunds are issued through
          Paddle to your original payment method, usually within 5–10 business days.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">4. Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href={`mailto:${CONTACT}`} className="text-indigo-400 hover:text-indigo-300">{CONTACT}</a>.
        </p>
      </article>
    </main>
  );
}
