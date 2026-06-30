"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeNames } from "@/lib/i18n";
import { useLocale } from "@/components/I18nProvider";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  function change(next: string) {
    // Persist for a year; server components read this cookie on refresh.
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-2.5 text-gray-400" aria-hidden>
        {/* globe */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
        </svg>
      </span>
      <select
        aria-label="Language"
        value={locale}
        disabled={pending}
        onChange={(e) => change(e.target.value)}
        className="appearance-none bg-gray-900/70 border border-gray-700 hover:border-gray-500 text-gray-200 text-sm rounded-lg pl-8 pr-7 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-gray-900 text-gray-100">
            {localeNames[l]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-gray-500" aria-hidden>
        ▾
      </span>
    </label>
  );
}
