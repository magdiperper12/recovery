"use client";

import Link from "next/link";
import { useArabicTranslations } from "@/lib/translations";

interface PhasePageContentProps {
  phase: number;
}

const checklistKeys = [
  "tasks.wake_6",
  "tasks.fajr",
  "tasks.gym",
  "tasks.backend_2h",
  "tasks.frontend_1h",
  "tasks.jobs",
  "tasks.no_porn",
  "tasks.sleep_1130"
];

export function PhasePageContent({ phase }: PhasePageContentProps) {
  const t = useArabicTranslations();
  const phaseKey = `sprints.${phase}`;

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-700 bg-card p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-100">{t("phasePage.title", { phase })}</h1>
          <Link href="/" className="rounded-lg bg-cardSoft px-3 py-2 text-xs text-slate-200 hover:bg-slate-700">
            {t("phasePage.backHome")}
          </Link>
        </div>
        <p className="text-sm text-slate-300">{t(`${phaseKey}.mainGoal`)}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">{t("phasePage.topKpis")}</h2>
          <p className="text-sm text-slate-200">{t(`${phaseKey}.kpis`)}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">{t("phasePage.nonNegotiables")}</h2>
          <ul className="space-y-2 text-sm text-slate-200">
            {checklistKeys.map((key) => (
              <li key={key} className="rounded-lg bg-cardSoft px-3 py-2">
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">{t("phasePage.commonMistakes")}</h2>
          <p className="text-sm text-slate-200">{t(`${phaseKey}.mistakes`)}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">{t("phasePage.successRules")}</h2>
          <p className="text-sm text-slate-200">{t(`${phaseKey}.correction`)}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">{t("phasePage.referenceChecklist")}</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {checklistKeys.map((key) => (
            <div key={key} className="rounded-lg bg-cardSoft px-3 py-2 text-sm text-slate-200">
              [ ] {t(key)}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
