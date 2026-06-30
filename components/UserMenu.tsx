"use client";

import { signOut } from "next-auth/react";
import { useT } from "@/components/I18nProvider";

export default function UserMenu({ email }: { email: string }) {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-sm hidden sm:inline truncate max-w-[160px]" title={email}>
        {email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors"
      >
        {t.nav.signOut}
      </button>
    </div>
  );
}
