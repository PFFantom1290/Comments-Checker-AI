// ─────────────────────────────────────────────────────────────────────────────
// i18n engine. Client-safe (no next/headers here).
//
// `en` below is the single source of truth for the string shape. Every other
// language lives in lib/i18n.dicts.ts as a PARTIAL dictionary — any key it omits
// automatically falls back to English. That's what makes adding a language easy:
//   1. add its code to `locales`
//   2. add a native name to `localeNames` and an English name to `aiLanguageName`
//   3. add a (partial or full) dictionary in lib/i18n.dicts.ts
// No need to translate every string up front.
// ─────────────────────────────────────────────────────────────────────────────

import { translations } from "@/lib/i18n.dicts";

export const locales = [
  // English + Russian + Ukrainian
  "en", "ru", "uk",
  // EU official languages
  "de", "fr", "es", "it", "pt", "nl", "pl", "sv", "da", "fi", "cs", "sk",
  "ro", "el", "hu", "bg", "hr", "sl", "et", "lv", "lt", "ga", "mt",
  // Asian
  "zh", "ja", "ko", "hi", "id", "vi",
] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Native names for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English", ru: "Русский", uk: "Українська",
  de: "Deutsch", fr: "Français", es: "Español", it: "Italiano", pt: "Português",
  nl: "Nederlands", pl: "Polski", sv: "Svenska", da: "Dansk", fi: "Suomi",
  cs: "Čeština", sk: "Slovenčina", ro: "Română", el: "Ελληνικά", hu: "Magyar",
  bg: "Български", hr: "Hrvatski", sl: "Slovenščina", et: "Eesti", lv: "Latviešu",
  lt: "Lietuvių", ga: "Gaeilge", mt: "Malti",
  zh: "中文", ja: "日本語", ko: "한국어", hi: "हिन्दी", id: "Bahasa Indonesia", vi: "Tiếng Việt",
};

/** English language name passed to the AI so it answers in the user's language. */
export const aiLanguageName: Record<Locale, string> = {
  en: "English", ru: "Russian", uk: "Ukrainian",
  de: "German", fr: "French", es: "Spanish", it: "Italian", pt: "Portuguese",
  nl: "Dutch", pl: "Polish", sv: "Swedish", da: "Danish", fi: "Finnish",
  cs: "Czech", sk: "Slovak", ro: "Romanian", el: "Greek", hu: "Hungarian",
  bg: "Bulgarian", hr: "Croatian", sl: "Slovenian", et: "Estonian", lv: "Latvian",
  lt: "Lithuanian", ga: "Irish", mt: "Maltese",
  zh: "Simplified Chinese", ja: "Japanese", ko: "Korean", hi: "Hindi",
  id: "Indonesian", vi: "Vietnamese",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Replace {name} placeholders, e.g. fmt("{n} left", { n: 3 }). */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

// ── English base — the canonical string shape ────────────────────────────────
export const en = {
  nav: { signOut: "Sign out", buyScans: "Buy scans" },
  home: {
    badge: "AI-powered review analysis",
    subtitle:
      "Paste any product URL. We read the real customer reviews so you don't have to — and give you a plain Buy / Don't Buy verdict.",
  },
  landing: {
    signIn: "Sign in",
    getStarted: "Get 3 free scans",
    heroKicker: "Stop reading fake reviews",
    heroTitle: "Know if it's worth buying — in seconds",
    heroBody:
      "Paste any product link — for example from Amazon, eBay, Walmart or most stores. Our AI reads the real customer reviews and gives you a clear Buy / Don't Buy verdict, pros and cons, a fake-review risk score, and a bottom-line recommendation.",
    tryFree: "Try 3 scans free",
    howTitle: "How it works",
    how1Title: "1. Paste a product link",
    how1Body: "From most product pages with public customer reviews.",
    how2Title: "2. We read the reviews",
    how2Body: "Our engine fetches the real customer reviews from the page — no marketing copy, no ads.",
    how3Title: "3. Get a clear verdict",
    how3Body: "Our AI analyzes the reviews and returns a Buy / Don't Buy call, pros and cons, and a fake-review risk score.",
    featuresTitle: "What you get with every scan",
    f1: "Buy / Don't Buy verdict with confidence score",
    f2: "Estimated true star rating",
    f3: "Sentiment breakdown (% positive / neutral / negative)",
    f4: "What people love vs. common complaints",
    f5: "Fake-review risk assessment",
    f6: "Bottom-line recommendation — who should buy, who should skip",
    pricingTitle: "Simple, honest pricing",
    pricingSub: "3 free scans on sign-up. Buy more only when you need them — purchased scans never expire.",
    perScan: "{c}¢ / scan",
    ctaTitle: "Ready to see what real reviewers say?",
    ctaBody: "Create your account and get 3 free scans — no card required.",
    ctaButton: "Create free account",
  },
  analyzer: {
    analyze: "Analyze",
    analyzing: "Analyzing…",
    unlimited: "Unlimited scans · admin",
    scansLeft: "{n} scans remaining",
    noScans: "No scans left",
    buyMore: "Buy more",
    loading: "Fetching page → extracting reviews → running AI analysis…",
    errorTitle: "Analysis failed",
    tryAnother: "Try another URL",
    outTitle: "You're out of scans",
    outBody: "Grab a scan pack to keep analyzing — packages start at $1.99 and never expire.",
    buyScans: "Buy scans",
    supported:
      "Works on Amazon, eBay, Walmart, Best Buy, Rozetka, Comfy, and most product pages with publicly visible reviews.",
  },
  result: {
    product: "Product",
    confidence: "{n}% confidence",
    estRating: "Est. rating",
    reviewsRead: "Reviews read",
    fakeRisk: "Fake-review risk",
    riskLow: "Low",
    riskMedium: "Medium",
    riskHigh: "High",
    sentiment: "Review sentiment",
    positive: "positive",
    neutral: "neutral",
    negative: "negative",
    bottomLine: "Bottom line",
    love: "What people love",
    complaints: "Common complaints",
    none: "None identified",
    details: "By the details",
    bestFor: "Best for",
    watchOut: "Watch out for",
    summary: "Summary",
    authenticity: "Authenticity",
    analyzeAnother: "Analyze another",
    buy: "BUY",
    dontBuy: "DON'T BUY",
    mixed: "MIXED",
  },
  auth: {
    welcomeBack: "Welcome back",
    signInSub: "Sign in to analyze product reviews.",
    createTitle: "Create your account",
    createSub: "Get 3 free AI review analyses.",
    name: "Name (optional)",
    email: "Email",
    password: "Password",
    confirm: "Confirm password",
    signIn: "Sign in",
    create: "Create account",
    pleaseWait: "Please wait…",
    or: "or",
    google: "Continue with Google",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    haveAccount: "Already have an account?",
    invalid: "Invalid email or password.",
    mismatch: "Passwords don't match.",
    short: "Password must be at least 8 characters.",
  },
  billing: {
    back: "← Back to analyzer",
    title: "Choose your plan",
    youHave: "You currently have {n} scans available.",
    youHaveTotal: "You currently have {n} scans available. Pick a plan below to add a monthly allowance.",
    activePlan: "You're on the {plan} plan — {used} of {limit} scans used this cycle.",
    renewsOn: "Renews on {date}. Unused scans reset each cycle.",
    freePlanNote: "Includes {free} free lifetime scans + {plan} plan scans this cycle.",
    subscribeNote: "Subscriptions renew monthly. Cancel anytime; your plan stays active until the end of the paid period.",
    currentPlan: "Current plan",
    subscribe: "Subscribe",
    adminUnlimited: "You're an admin — you already have unlimited scans.",
    canceled: "Checkout canceled — you weren't charged.",
    scans: "scans",
    scansPerMonth: "scans / month",
    perMonth: "/ month",
    perScan: "{c}¢ / scan",
    buy: "Buy",
    opening: "Opening checkout…",
    secured: "Payments are processed securely by Paddle, our merchant of record. Cards are never stored on our servers.",
  },
  success: {
    successTitle: "Payment successful",
    subActiveTitle: "Your subscription is active",
    subActiveBody: "You're on the {plan} plan — {scans} scans per month.",
    added: "{n} scans added to your account.",
    youNow: "You now have {n} scans available.",
    renewsOn: "Renews on {date}.",
    almost: "Almost there",
    start: "Start analyzing",
    manage: "Manage subscription",
    buyMore: "Buy more",
  },
};

export type Dict = typeof en;
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * Returns a COMPLETE dictionary for the locale: the language's translations
 * deep-merged over the English base, so any missing key falls back to English.
 */
export function getDictionary(locale: Locale): Dict {
  const override = translations[locale];
  if (!override) return en;
  const ov = override as Record<string, Record<string, string>>;
  const out: Record<string, unknown> = {};
  for (const section of Object.keys(en) as (keyof Dict)[]) {
    out[section] = { ...en[section], ...(ov[section] ?? {}) };
  }
  return out as unknown as Dict;
}
