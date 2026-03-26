"use client";

import { SPRINTS } from "@/data/plan";
import { useTranslations } from "next-intl";

export function OperatingSystemPlan() {
  const t = useTranslations();

  return (
    <section className="space-y-4 rounded-2xl border border-slate-700 bg-card p-4">
      <h2 className="text-lg font-semibold text-slate-100">{t("operatingSystem.title")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-start text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-300">
              <th className="py-2 pe-4">{t("operatingSystem.headers.sprint")}</th>
              <th className="py-2 pe-4">{t("operatingSystem.headers.focus")}</th>
              <th className="py-2 pe-4">{t("operatingSystem.headers.mainGoal")}</th>
              <th className="py-2 pe-4">{t("operatingSystem.headers.kpis")}</th>
              <th className="py-2 pe-4">{t("operatingSystem.headers.mistakes")}</th>
            </tr>
          </thead>
          <tbody>
            {SPRINTS.map((s) => (
              <tr key={s.sprintNumber} className="border-b border-slate-800 align-top text-slate-200">
                <td className="py-3 pe-4">#{s.sprintNumber} (D{s.startDay}-{s.endDay})</td>
                <td className="py-3 pe-4">{t(`sprints.${s.sprintNumber}.focus`)}</td>
                <td className="py-3 pe-4">{t(`sprints.${s.sprintNumber}.mainGoal`)}</td>
                <td className="py-3 pe-4">{t(`sprints.${s.sprintNumber}.kpis`)}</td>
                <td className="py-3 pe-4">{t(`sprints.${s.sprintNumber}.mistakes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-300">{t("operatingSystem.recoveryProtocol")}</p>
    </section>
  );
}
