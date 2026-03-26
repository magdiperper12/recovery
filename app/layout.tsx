import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Cairo, Inter } from "next/font/google";
import { getDirection, isLocale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-latin" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "120-Day Daily Checklist System",
  description: "Arabic-first RTL checklist and transformation operating system."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const localeValue = await getLocale();
  const locale = isLocale(localeValue) ? localeValue : "ar";
  const messages = await getMessages();

  return (
    <html lang={locale} dir={getDirection(locale)}>
      <body className={`${inter.variable} ${cairo.variable}`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
