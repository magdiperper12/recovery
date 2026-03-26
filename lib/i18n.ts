export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const FALLBACK_LOCALE: AppLocale = "ar";

export const isLocale = (value: string): value is AppLocale =>
  SUPPORTED_LOCALES.includes(value as AppLocale);

export const getDirection = (locale: AppLocale) => (locale === "ar" ? "rtl" : "ltr");
