import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, getDictionary, type Locale } from "@/lib/i18n";

export const LOCALE_COOKIE = "locale";

/** Current locale from the cookie (defaults to English). Server components only. */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Convenience: locale + its dictionary in one call. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
