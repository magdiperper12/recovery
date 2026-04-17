"use client";

import Link from "next/link";
import { useArabicTranslations } from "@/lib/translations";

export function SubPagesNav() {
  const t = useArabicTranslations();

  return (
    <nav className="rounded-2xl border border-slate-700 bg-card p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">{t("nav.title")}</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((phase) => (
          <Link
            key={phase}
            href={`/phase-${phase}`}
            className="rounded-lg bg-cardSoft px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
          >
            {t("nav.phaseLink", { phase })}
          </Link>
        ))}
        <Link
          href="/full-overview"
          className="rounded-lg bg-warn/20 px-3 py-2 text-sm text-warn transition hover:bg-warn/30"
        >
          {t("nav.fullOverview")}
        </Link>
      </div>
    </nav>
  );
}
