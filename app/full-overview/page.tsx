"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ProgressBar";
import {
  GOAL_IDS,
  TRACKING_START_DATE_KEY,
  buildGoalProgressHistory,
  computeGoalAggregateProgress
} from "@/lib/logic";
import { DayState, GoalProgressHistory } from "@/lib/types";
import { readVersionedStorage, writeVersionedStorage } from "@/lib/storage";

interface PersistedData {
  streak: number;
  history: DayState[];
  current: DayState;
  goalProgressHistory?: GoalProgressHistory;
}

export default function FullOverviewPage() {
  const locale = useLocale();
  const t = useTranslations();
  const numberFormatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");
  const [goalHistory, setGoalHistory] = useState<GoalProgressHistory>({});
  const goals = GOAL_IDS;

  useEffect(() => {
    const readProgress = () => {
      const parsed = readVersionedStorage().data as PersistedData;
      const allDays = [...parsed.history, parsed.current];
      const computedHistory = buildGoalProgressHistory(allDays, TRACKING_START_DATE_KEY);
      const nextData: PersistedData = {
        ...parsed,
        goalProgressHistory: computedHistory
      };
      writeVersionedStorage(nextData);
      setGoalHistory(computedHistory);
    };

    readProgress();
    const refreshTimer = window.setInterval(readProgress, 2000);
    const onStorage = () => readProgress();
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const aggregatedProgress = useMemo(
    () =>
      Object.fromEntries(goals.map((goalId) => [goalId, computeGoalAggregateProgress(goalId, goalHistory)])),
    [goalHistory]
  ) as Record<(typeof goals)[number], number>;

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-700 bg-card p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-100">{t("overviewPage.title")}</h1>
          <Link href="/" className="rounded-lg bg-cardSoft px-3 py-2 text-xs text-slate-200 hover:bg-slate-700">
            {t("overviewPage.backHome")}
          </Link>
        </div>
        <p className="text-sm text-slate-300">{t("overviewPage.subtitle")}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goalId) => {
          const progress = aggregatedProgress[goalId] ?? 0;
          const priority = t(`overviewPage.goals.${goalId}.priority`);
          const priorityClass =
            priority === "high"
              ? "bg-bad/20 text-bad"
              : priority === "medium"
                ? "bg-warn/20 text-warn"
                : "bg-ok/20 text-ok";

          return (
            <article key={goalId} className="rounded-2xl border border-slate-700 bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-2xl">{t(`overviewPage.goals.${goalId}.icon`)}</span>
                <span className={`rounded-md px-2 py-1 text-xs ${priorityClass}`}>
                  {t(`overviewPage.priority.${priority}`)}
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-100">
                {t(`overviewPage.goals.${goalId}.title`)}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{t(`overviewPage.goals.${goalId}.description`)}</p>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{t("overviewPage.progress")}</span>
                  <span>{numberFormatter.format(progress)}%</span>
                </div>
                <ProgressBar value={progress} />
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
