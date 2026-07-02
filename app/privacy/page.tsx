import Link from "next/link";

export const metadata = { title: "Privacy Policy — ReviewX" };

const UPDATED = "30 June 2026";
const CONTACT = "ivanhavrylenko13@gmail.com";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen text-gray-200 px-4 py-16">
      <article className="max-w-2xl mx-auto space-y-5 leading-relaxed text-sm">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: {UPDATED}</p>

        <p>
          This policy explains what data ReviewX (the “Service”) collects and how we use
          it. We aim to collect only what we need to run the Service.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">1. What we collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Account data:</strong> your email and name. For email/password accounts we store a securely hashed password (never the plain text). For Google sign-in we receive your email and name from Google.</li>
          <li><strong>Usage data:</strong> your remaining and purchased scan balance, and the product URLs you submit for analysis.</li>
          <li><strong>Payment data:</strong> handled entirely by Paddle. We receive a record that a purchase occurred (amount, package) but never see or store your card details.</li>
          <li><strong>Cookies:</strong> a session cookie to keep you signed in, and a small cookie storing your chosen language. We do not use advertising trackers.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white pt-2">2. How we use it</h2>
        <p>
          To create and secure your account, run analyses, track your scan balance, process purchases,
          provide support, and prevent abuse. We do not sell your personal data.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">3. Service providers</h2>
        <p>To operate the Service we share limited data with:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Neon</strong> — database hosting (stores your account record).</li>
          <li><strong>Vercel</strong> — application hosting.</li>
          <li><strong>Google</strong> — optional sign-in.</li>
          <li><strong>Paddle</strong> — payment processing and Merchant of Record.</li>
          <li><strong>OpenAI</strong> — the review text from the page you submit is sent for AI analysis.</li>
          <li><strong>Jina AI / ScraperAPI</strong> — fetch the public product page you submit.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white pt-2">4. Retention</h2>
        <p>
          We keep your account data while your account exists. Analysis results may be cached
          temporarily to improve performance. You can request deletion of your account and associated
          personal data by contacting us.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">5. Your rights</h2>
        <p>
          Depending on your location (e.g., the EU/EEA under GDPR), you may have the right to access,
          correct, export, or delete your personal data, and to object to certain processing. To
          exercise these rights, contact us at the address below.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">6. Security</h2>
        <p>
          We use industry-standard measures including password hashing and encrypted connections. No
          system is perfectly secure, but we work to protect your data.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">7. Changes &amp; contact</h2>
        <p>
          We may update this policy and will revise the date above. Questions or requests:{" "}
          <a href={`mailto:${CONTACT}`} className="text-indigo-400 hover:text-indigo-300">{CONTACT}</a>.
        </p>
      </article>
    </main>
  );
}
