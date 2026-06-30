import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserByEmail, availableScans, isAdminEmail } from "@/lib/users";
import { getI18n } from "@/lib/i18n.server";
import Analyzer from "@/components/Analyzer";
import UserMenu from "@/components/UserMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function HomePage() {
  // Gate: only signed-in users reach the analyzer.
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const { t } = await getI18n();
  const admin = isAdminEmail(session.user.email);
  const user = await getUserByEmail(session.user.email);
  const remaining = user ? availableScans(user) : 0;

  return (
    <main className="min-h-screen text-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b border-gray-800/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <span className="font-semibold tracking-tight text-gray-200">Shopping Truth Filter</span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu email={session.user.email} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-16">
        {/* Hero */}
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
