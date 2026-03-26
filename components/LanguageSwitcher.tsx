"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();

  const updateLocale = (nextLocale: "ar" | "en") => {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-cardSoft p-1 text-xs">
      <span className="px-2 text-slate-300">{t("switchLabel")}:</span>
      <button
        className={`rounded-md px-2 py-1 ${locale === "ar" ? "bg-ok/20 text-ok" : "text-slate-300"}`}
        onClick={() => updateLocale("ar")}
      >
        {t("arabic")}
      </button>
      <button
        className={`rounded-md px-2 py-1 ${locale === "en" ? "bg-ok/20 text-ok" : "text-slate-300"}`}
        onClick={() => updateLocale("en")}
      >
        {t("english")}
      </button>
    </div>
  );
}
