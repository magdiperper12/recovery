"use client";

import { useEffect, useMemo } from "react";
import { MOTIVATION_MESSAGES, SPRINTS, TASKS } from "@/data/plan";
import { ChecklistSection } from "@/components/ChecklistSection";
import { DataSafetyPanel } from "@/components/DataSafetyPanel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProgressBar } from "@/components/ProgressBar";
import { SprintGrid } from "@/components/SprintGrid";
import { SubPagesNav } from "@/components/SubPagesNav";
import { useStorage } from "@/hooks/useStorage";
import { useUserSync } from "@/hooks/useUserSync";
import { useLocale, useTranslations } from "next-intl";
import {
  RECOVERY_DAYS,
  computeDisciplineScore,
  computeProgress,
  getCurrentDayNumber,
  getDateKey,
  getPhaseContext,
  getPhaseLength,
  getSprintDayIndex,
  getSprintNumber,
  isRecoveryDay,
  shouldIncreaseStreak
} from "@/lib/logic";
import { hydrateAppState } from "@/lib/logic";

const groupedTasks = TASKS.reduce<Record<string, typeof TASKS>>((acc, task) => {
  if (!acc[task.category]) acc[task.category] = [];
  acc[task.category].push(task);
  return acc;
}, {});

export default function Page() {
  const t = useTranslations();
  const locale = useLocale();
  const { state: data, setState: setData, ready: mounted, error, clearError, exportData, importData, resetData } = useStorage();
  const sync = useUserSync(data, mounted, (updater) => setData((prev) => updater(hydrateAppState(prev))));

  useEffect(() => {
    if (!mounted) return;
    const todayKey = getDateKey();
    if (data.current.dateKey === todayKey) return;
    const incrementStreak = shouldIncreaseStreak(data.current.checks, data.current.relapse);
    const nextStreak = data.current.relapse ? 0 : incrementStreak ? data.streak + 1 : data.streak;
    setData((prev) =>
      hydrateAppState({
        ...prev,
        streak: nextStreak,
        history: [...prev.history, prev.current],
        current: {
          ...prev.current,
          dateKey: todayKey,
          checks: Object.fromEntries(TASKS.map((task) => [task.id, false])),
          note: "",
          badDay: false,
          relapse: false,
          dayNumber: getCurrentDayNumber(prev.current.startDate)
        }
      })
    );
  }, [mounted, data.current.dateKey]);

  const progress = useMemo(() => computeProgress(data.current.checks), [data.current.checks]);
  const disciplineScore = useMemo(
    () => computeDisciplineScore(data.current.checks, data.current.relapse, data.current.badDay),
    [data.current.badDay, data.current.checks, data.current.relapse]
  );
  const sprintNumber = getSprintNumber(data.current.dayNumber);
  const sprintDayIndex = getSprintDayIndex(data.current.dayNumber);
  const phaseLength = getPhaseLength(data.current.dayNumber);
  const phaseContext = getPhaseContext(data.current.dayNumber);
  const sprint = SPRINTS[sprintNumber - 1];
  const recovery = isRecoveryDay(data.current.dayNumber);
  const message =
    MOTIVATION_MESSAGES.find((m) => disciplineScore >= m.min && disciplineScore <= m.max)?.message ??
    "motivation.mid";

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        maximumFractionDigits: 0
      }),
    [locale]
  );
  const todayFormatted = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(new Date()),
    [locale]
  );

  const toggleTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        checks: {
          ...prev.current.checks,
          [taskId]: !prev.current.checks[taskId]
        }
      }
    }));
  };

  if (!mounted) {
    return <main className="mx-auto max-w-6xl p-6 text-slate-300">{t("app.loading")}</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-700 bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-100">{t("app.title")}</h1>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cardSoft px-2 py-1 text-xs text-slate-300">Sync: {sync.status}</span>
            <LanguageSwitcher />
            <button onClick={sync.signOut} className="rounded-md bg-cardSoft px-2 py-1 text-xs text-slate-200">
              Logout
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400">{todayFormatted}</p>
        <p className="mt-2 text-sm text-slate-300">
          {t("stats.daySprint", {
            sprint: formatter.format(sprintNumber),
            sprintDay: formatter.format(sprintDayIndex),
            phaseLength: formatter.format(phaseLength)
          })}
          {recovery
            ? ` | ${t("stats.recovery", {
                days: formatter.format(RECOVERY_DAYS),
                recoveryDay: formatter.format(phaseContext.recoveryDayIndex)
              })}`
            : ""}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-cardSoft p-3">
            <p className="text-xs uppercase text-slate-400">{t("stats.todayProgress")}</p>
            <p className="mt-1 text-xl font-semibold text-slate-100">{formatter.format(progress.percent)}%</p>
          </div>
          <div className="rounded-xl bg-cardSoft p-3">
            <p className="text-xs uppercase text-slate-400">{t("stats.cleanStreak")}</p>
            <p className="mt-1 text-xl font-semibold text-ok">{t("stats.days", { count: formatter.format(data.streak) })}</p>
          </div>
          <div className="rounded-xl bg-cardSoft p-3">
            <p className="text-xs uppercase text-slate-400">{t("stats.disciplineScore")}</p>
            <p className="mt-1 text-xl font-semibold text-warn">{formatter.format(disciplineScore)}/100</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={progress.percent} />
          <p className="mt-2 text-xs text-slate-400">
            {t("stats.tasksCompleted", {
              completed: formatter.format(progress.completed),
              total: formatter.format(progress.total)
            })}
          </p>
        </div>
        <p className="mt-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200">{t(message)}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {Object.entries(groupedTasks).map(([category, tasks]) => (
          <ChecklistSection
            key={category}
            title={t(`categories.${category}`)}
            tasks={tasks.map((task) => ({ ...task, label: t(task.labelKey) }))}
            checks={data.current.checks}
            onToggle={toggleTask}
            doneLabel={t("taskStatus.done")}
            pendingLabel={t("taskStatus.pending")}
          />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">{t("controls.title")}</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center justify-between rounded-lg bg-cardSoft px-3 py-2">
              <span>{t("controls.relapse")}</span>
              <input
                type="checkbox"
                checked={data.current.relapse}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    current: { ...prev.current, relapse: e.target.checked }
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between rounded-lg bg-cardSoft px-3 py-2">
              <span>{t("controls.badDay")}</span>
              <input
                type="checkbox"
                checked={data.current.badDay}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    current: { ...prev.current, badDay: e.target.checked }
                  }))
                }
              />
            </label>
          </div>
          <textarea
            className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none"
            rows={4}
            placeholder={t("controls.notesPlaceholder")}
            value={data.current.note}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                current: { ...prev.current, note: e.target.value }
              }))
            }
          />
        </div>
        <SprintGrid
          sprintNumber={sprintNumber}
          sprintDayIndex={sprintDayIndex}
          phaseLength={phaseLength}
          showRecovery={sprintNumber < SPRINTS.length}
          recoveryDays={RECOVERY_DAYS}
          checks={data.current.checks}
          title={t("sprint.gridTitle", {
            sprint: formatter.format(sprintNumber),
            phaseLength: formatter.format(phaseLength)
          })}
          todayLabel={t("sprint.today", { day: formatter.format(sprintDayIndex) })}
          dayPrefix={t("sprint.dayPrefix")}
          recoveryLabel={t("sprint.recoveryLabel")}
        />
      </section>

      <section className="rounded-2xl border border-slate-700 bg-card p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t("sprint.title")}</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-200">
          <p>
            <strong>{t("sprint.focus")}</strong> {t(`sprints.${sprintNumber}.focus`)}
          </p>
          <p>
            <strong>{t("sprint.mainGoal")}</strong> {t(`sprints.${sprintNumber}.mainGoal`)}
          </p>
          <p>
            <strong>{t("sprint.correction")}</strong> {t(`sprints.${sprintNumber}.correction`)}
          </p>
          <p>
            <strong>{t("sprint.review")}</strong> {t(`sprints.${sprintNumber}.review`)}
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-cardSoft p-3 text-sm text-slate-200">
            <p className="mb-1 text-xs uppercase text-slate-400">{t("systems.fatLossTitle")}</p>
            <p>{t("systems.fatLossBody")}</p>
          </div>
          <div className="rounded-xl bg-cardSoft p-3 text-sm text-slate-200">
            <p className="mb-1 text-xs uppercase text-slate-400">{t("systems.incomeTitle")}</p>
            <p>{t("systems.incomeBody")}</p>
          </div>
        </div>
      </section>
      <SubPagesNav />
      <section className="grid gap-4 md:grid-cols-2">
        <DataSafetyPanel
          onExport={exportData}
          onImport={importData}
          onReset={resetData}
          error={error}
          clearError={clearError}
        />
        <div className="rounded-2xl border border-slate-700 bg-card p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Cloud Sync</p>
          <p className="mt-2">User: {sync.userId ?? "unknown"}</p>
          <p className="mt-1">Status: {sync.status}</p>
        </div>
      </section>
    </main>
  );
}
