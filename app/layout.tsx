import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "@/lib/i18n.server";
import { getDictionary } from "@/lib/i18n";
import { I18nProvider } from "@/components/I18nProvider";
import Backdrop from "@/components/Backdrop";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://comments-checker-ai.vercel.app"),
  title: "AI Shopping Truth Filter",
  description:
    "Paste any product URL and get an instant Buy / Don't Buy verdict based on real customer reviews — powered by AI.",
  openGraph: {
    title: "AI Shopping Truth Filter",
    description: "Stop reading fake reviews. Get the real verdict instantly.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Backdrop />
        <I18nProvider locale={locale} dict={dict}>
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
