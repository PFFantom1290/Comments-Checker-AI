import Link from "next/link";

export const metadata = { title: "Terms of Service — Shopping Truth Filter" };

const UPDATED = "30 June 2026";
const CONTACT = "ivanhavrylenko13@gmail.com";

export default function TermsPage() {
  return (
    <main className="min-h-screen text-gray-200 px-4 py-16">
      <article className="max-w-2xl mx-auto space-y-5 leading-relaxed text-sm">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="text-gray-500">Last updated: {UPDATED}</p>

        <p>
          These Terms govern your use of Shopping Truth Filter (the “Service”), an AI tool that
          reads publicly available product reviews and produces a summarized assessment. By creating
          an account or using the Service, you agree to these Terms.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">1. The service</h2>
        <p>
          The Service fetches publicly visible customer reviews for a product URL you provide and
          uses AI to generate a verdict, pros and cons, and a summary. Results are automated
          estimates for informational purposes only and may be inaccurate or incomplete. They are not
          professional, financial, or purchasing advice, and we do not guarantee any outcome.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">2. Accounts</h2>
        <p>
          You must provide accurate information and keep your credentials secure. You are responsible
          for activity under your account. You must be old enough to form a binding contract in your
          jurisdiction.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">3. Scans and credits</h2>
        <p>
          Each account receives a limited number of free analyses (“scans”). Additional scans can be
          purchased in packs. Purchased scans are added to your balance, are non-transferable, have no
          cash value, and are consumed when you run an analysis. We may change pricing or free
          allowances for future purchases.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">4. Payments</h2>
        <p>
          Payments are processed by our reseller and Merchant of Record, <strong>Paddle.com</strong>,
          who handles the order, billing, and related inquiries. Your purchase is subject to Paddle’s
          buyer terms in addition to ours. Prices are shown before purchase. See our{" "}
          <Link href="/refund" className="text-indigo-400 hover:text-indigo-300">Refund Policy</Link>.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">5. Acceptable use</h2>
        <p>
          Do not use the Service to break the law, infringe rights, overload or attack the Service,
          resell access, or submit URLs you are not permitted to analyze. We may suspend accounts that
          abuse the Service.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">6. Third-party content</h2>
        <p>
          The Service relies on third-party websites and providers to fetch pages and run AI. We do
          not control and are not responsible for third-party content, availability, or terms.
          Trademarks and product names belong to their respective owners.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">7. Disclaimers &amp; liability</h2>
        <p>
          The Service is provided “as is” without warranties of any kind. To the maximum extent
          permitted by law, we are not liable for indirect or consequential damages, and our total
          liability is limited to the amount you paid us in the 3 months before the claim.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">8. Changes &amp; termination</h2>
        <p>
          We may update these Terms or the Service at any time; continued use means you accept the
          changes. You may stop using the Service at any time. We may suspend or terminate accounts
          that violate these Terms.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">9. Governing law &amp; contact</h2>
        <p>
          These Terms are governed by the laws of Ukraine. Questions:{" "}
          <a href={`mailto:${CONTACT}`} className="text-indigo-400 hover:text-indigo-300">{CONTACT}</a>.
        </p>
      </article>
    </main>
  );
}
