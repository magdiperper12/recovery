import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const FALLBACK_LOCALE = "ar";
const SUPPORTED_LOCALES = ["en", "ar"] as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCandidate = cookieStore.get("locale")?.value ?? FALLBACK_LOCALE;
  const locale = SUPPORTED_LOCALES.includes(localeCandidate as (typeof SUPPORTED_LOCALES)[number])
    ? localeCandidate
    : FALLBACK_LOCALE;

  return {
    locale,
    messages: (await import(`../locales/${locale}/common.json`)).default
  };
});
