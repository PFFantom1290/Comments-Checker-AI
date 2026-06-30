"use client";

import { createContext, useContext } from "react";
import type { Dict, Locale } from "@/lib/i18n";

interface I18nValue {
  locale: Locale;
  t: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, t: dict }}>{children}</I18nContext.Provider>;
}

/** Translations dictionary for client components. */
export function useT(): Dict {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within <I18nProvider>");
  return ctx.t;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used within <I18nProvider>");
  return ctx.locale;
}
