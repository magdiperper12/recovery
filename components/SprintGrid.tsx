"use client";

interface SprintGridProps {
  sprintNumber: number;
  sprintDayIndex: number;
  phaseLength: number;
  showRecovery: boolean;
  recoveryDays: number;
  checks: Record<string, boolean>;
  title: string;
  todayLabel: string;
  dayPrefix: string;
  recoveryLabel: string;
}

export function SprintGrid({
  sprintNumber,
  sprintDayIndex,
  phaseLength,
  showRecovery,
  recoveryDays,
  checks,
  title,
  todayLabel,
  dayPrefix,
  recoveryLabel
}: SprintGridProps) {
  const completion = Math.round(
    (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100
  );

  return (
    <section className="rounded-2xl border border-slate-700 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          {title}
        </h3>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
          {todayLabel}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: phaseLength }, (_, i) => {
          const day = i + 1;
          const status =
            day < sprintDayIndex
              ? completion >= 80
                ? "bg-ok/30 text-ok border-ok/40"
                : "bg-bad/30 text-bad border-bad/40"
              : day === sprintDayIndex
                ? "bg-warn/30 text-warn border-warn/40"
                : "bg-slate-800 text-slate-400 border-slate-700";

          return (
            <div
              key={day}
              className={`rounded-lg border px-2 py-3 text-center text-xs font-medium ${status}`}
            >
              {dayPrefix}
              {day}
            </div>
          );
        })}
        {showRecovery &&
          Array.from({ length: recoveryDays }, (_, i) => (
            <div
              key={`recovery-${i + 1}`}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-2 py-3 text-center text-xs font-medium text-cyan-300"
            >
              {recoveryLabel} {i + 1}
            </div>
          ))}
      </div>
    </section>
  );
}
