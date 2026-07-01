import Link from "next/link";
import { auth } from "@/auth";
import { getUserByEmail, availableScans, isAdminEmail } from "@/lib/users";
import { getI18n } from "@/lib/i18n.server";
import { fmt } from "@/lib/i18n";
import { PLANS } from "@/lib/paddle";
import Analyzer from "@/components/Analyzer";
import UserMenu from "@/components/UserMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function HomePage() {
  const { t } = await getI18n();
  const session = await auth();

  // ── Public landing page (signed-out visitors + web crawlers like Paddle) ──
  // Payment providers reject sites that gate their entire homepage behind auth;
  // this page is a real product description with pricing, features, and CTAs.
  if (!session?.user?.email) {
    const plans = Object.values(PLANS);
    return (
      <main className="min-h-screen text-gray-100 flex flex-col">
        <header className="w-full border-b border-gray-800/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <span className="font-semibold tracking-tight text-gray-200">Shopping Truth Filter</span>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors"
              >
                {t.landing.signIn}
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg px-3 py-1.5 transition-colors"
              >
                {t.landing.getStarted}
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="px-4 py-20 flex flex-col items-center text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-indigo-900/40 border border-indigo-700/50 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            {t.home.badge}
          </div>
          <p className="text-indigo-300/80 text-sm uppercase tracking-widest mb-3">{t.landing.heroKicker}</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-glow bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent max-w-3xl">
            {t.landing.heroTitle}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mb-8">{t.landing.heroBody}</p>
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-7 py-3 transition-colors shadow-lg shadow-indigo-900/30"
          >
            {t.landing.tryFree}
          </Link>
        </section>

        {/* How it works */}
        <section className="px-4 py-16 max-w-5xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">{t.landing.howTitle}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              [t.landing.how1Title, t.landing.how1Body],
              [t.landing.how2Title, t.landing.how2Body],
              [t.landing.how3Title, t.landing.how3Body],
            ].map(([title, body], i) => (
              <div key={i} className="lift bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-white font-semibold mb-2">{title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 max-w-3xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">{t.landing.featuresTitle}</h2>
          <ul className="space-y-3">
            {[t.landing.f1, t.landing.f2, t.landing.f3, t.landing.f4, t.landing.f5, t.landing.f6].map(
              (f, i) => (
                <li key={i} className="flex items-start gap-3 bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3">
                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span className="text-gray-200 text-sm">{f}</span>
                </li>
              )
            )}
          </ul>
        </section>

        {/* Pricing */}
        <section className="px-4 py-16 max-w-4xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">{t.landing.pricingTitle}</h2>
          <p className="text-gray-400 text-center mb-8">{t.landing.pricingSub}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className="lift relative bg-gray-900/60 border border-gray-700/70 rounded-2xl p-5 backdrop-blur-sm"
              >
                {p.tag && (
                  <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[11px] font-semibold rounded-full px-2.5 py-0.5">
                    {p.tag}
                  </span>
                )}
                <p className="text-white font-semibold">{p.name}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white">{p.scans}</span>
                  <span className="text-gray-400 text-sm">{t.billing.scansPerMonth}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-semibold text-indigo-300">${(p.priceCents / 100).toFixed(2)}</span>
                  <span className="text-gray-500 text-xs">{t.billing.perMonth}</span>
                </div>
                <p className="text-gray-600 text-[11px] mt-1">{fmt(t.landing.perScan, { c: (p.priceCents / p.scans).toFixed(1) })}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t.landing.ctaTitle}</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">{t.landing.ctaBody}</p>
          <Link
            href="/register"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-7 py-3 transition-colors shadow-lg shadow-indigo-900/30"
          >
            {t.landing.ctaButton}
          </Link>
        </section>
      </main>
    );
  }

  // ── Signed-in: the analyzer app ──
  const email = session.user.email;
  const admin = isAdminEmail(email);
  const user = await getUserByEmail(email);
  const remaining = user ? availableScans(user) : 0;

  return (
    <main className="min-h-screen text-gray-100 flex flex-col">
      <header className="w-full border-b border-gray-800/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <span className="font-semibold tracking-tight text-gray-200">Shopping Truth Filter</span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu email={email} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-16">
        <div className="text-center mb-10 max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-indigo-900/40 border border-indigo-700/50 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            {t.home.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-glow bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Shopping Truth Filter
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{t.home.subtitle}</p>
        </div>

        <Analyzer initialRemaining={remaining} unlimited={admin} />
      </div>
    </main>
  );
}
