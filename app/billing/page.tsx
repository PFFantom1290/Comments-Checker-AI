import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getUserByEmail,
  availableScans,
  remainingPlanScans,
  isPlanActive,
  isAdminEmail,
} from "@/lib/users";
import { PLANS, paddleEnvironment } from "@/lib/paddle";
import { getI18n } from "@/lib/i18n.server";
import { fmt } from "@/lib/i18n";
import ChoosePlan from "@/components/ChoosePlan";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; portal?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const { t, locale } = await getI18n();
  const email = session.user.email;
  const admin = isAdminEmail(email);
  const user = await getUserByEmail(email);
  const balance = user ? availableScans(user) : 0;
  const params = await searchParams;
  const canceled = params.canceled === "1";
  const portalError = params.portal === "error";

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

  const plans = Object.values(PLANS).map((p) => ({
    id: p.id,
    name: p.name,
    scans: p.scans,
    priceCents: p.priceCents,
    priceId: p.priceId,
    tag: p.tag,
  }));

  const activePlanId = user && isPlanActive(user) ? user.plan : null;
  const planScansLeft = user ? remainingPlanScans(user) : 0;

  return (
    <main className="min-h-screen text-gray-100 flex flex-col items-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-4xl animate-fade-up">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">
          {t.billing.back}
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-1">{t.billing.title}</h1>

        {admin ? (
          <p className="text-gray-400 mb-6">{t.billing.adminUnlimited}</p>
        ) : activePlanId && user ? (
          <div className="mb-6 bg-indigo-950/30 border border-indigo-800/40 rounded-xl px-4 py-3 text-sm text-gray-300">
            <p>
              {fmt(t.billing.activePlan, {
                plan: PLANS[activePlanId as keyof typeof PLANS]?.name ?? activePlanId,
                used: user.planScansUsed,
                limit: user.planScansLimit,
              })}
            </p>
            {user.planPeriodEnd && (
              <p className="text-gray-500 text-xs mt-1">
                {fmt(t.billing.renewsOn, { date: formatDate(user.planPeriodEnd, locale) })}
              </p>
            )}
            <a
              href="/api/paddle/portal"
              className="inline-block mt-3 text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              {t.billing.manageBilling}
            </a>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">{fmt(t.billing.youHaveTotal, { n: balance })}</p>
        )}

        {canceled && (
          <div className="mb-5 bg-yellow-950/40 border border-yellow-800/50 rounded-lg px-4 py-3 text-yellow-300 text-sm">
            {t.billing.canceled}
          </div>
        )}

        {portalError && (
          <div className="mb-5 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3 text-red-300 text-sm">
            We couldn&apos;t open the subscription portal. Please try again, or email{" "}
            <a href="mailto:ivanhavrylenko13@gmail.com" className="underline">
              ivanhavrylenko13@gmail.com
            </a>
            .
          </div>
        )}

        <ChoosePlan
          plans={plans}
          email={email}
          clientToken={clientToken}
          environment={paddleEnvironment}
          currentPlanId={activePlanId}
        />

        <div className="mt-6 space-y-1 text-center">
          <p className="text-gray-500 text-xs">
            {fmt(t.billing.freePlanNote, {
              free: user ? Math.max(0, 3 - user.scansUsed) : 3,
              plan: planScansLeft,
            })}
          </p>
          <p className="text-gray-600 text-xs">{t.billing.subscribeNote}</p>
          <p className="text-gray-600 text-xs">{t.billing.secured}</p>
        </div>
      </div>
    </main>
  );
}
