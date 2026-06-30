import { redirect } from "next/navigation";
import { auth, isGoogleEnabled } from "@/auth";
import AuthForm from "@/components/AuthForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="min-h-screen text-gray-100 flex items-center justify-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <AuthForm mode="register" googleEnabled={isGoogleEnabled} />
    </main>
  );
}
