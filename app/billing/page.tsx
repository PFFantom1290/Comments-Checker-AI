import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserByEmail, availableScans, isAdminEmail } from "@/lib/users";
import { SCAN_PACKAGES, paddleEnvironment } from "@/lib/paddle";
import { getI18n } from "@/lib/i18n.server";
import { fmt } from "@/lib/i18n";
import BuyScans from "@/components/BuyScans";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const { t } = await getI18n();
  const email = session.user.email;
  const admin = isAdminEmail(email);
  const user = await getUserByEmail(email);
  const balance = user ? availableScans(user) : 0;
  const canceled = (await searchParams).canceled === "1";

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

  const packages = Object.values(SCAN_PACKAGES).map((p) => ({
    id: p.id,
    scans: p.scans,
    priceCents: p.priceCents,
    priceId: p.priceId,
    tag: p.tag,
  }));

  return (
    <main className="min-h-screen text-gray-100 flex flex-col items-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-2xl animate-fade-up">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">
          {t.billing.back}
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-1">{t.billing.title}</h1>
        <p className="text-gray-400 mb-6">
          {admin ? t.billing.adminUnlimited : fmt(t.billing.youHave, { n: balance })}
        </p>

        {canceled && (
          <div className="mb-5 bg-yellow-950/40 border border-yellow-800/50 rounded-lg px-4 py-3 text-yellow-300 text-sm">
            {t.billing.canceled}
          </div>
        )}

        <BuyScans
          packages={packages}
          email={email}
          clientToken={clientToken}
          environment={paddleEnvironment}
        />

        <p className="text-gray-600 text-xs mt-6 text-center">{t.billing.secured}</p>
      </div>
    </main>
  );
}
