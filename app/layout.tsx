import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "نظام المتابعة اليومية - 120 يوم",
  description: "نظام متابعة يومية عربي بالكامل."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>{children}</body>
    </html>
  );
}
