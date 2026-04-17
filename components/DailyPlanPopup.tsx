"use client";

interface DailyPlanItem {
  offset: number;
  dateLabel: string;
  sprintNumber: number;
  sprintDayIndex: number;
  phaseLength: number;
  isRecovery: boolean;
  recoveryDayIndex: number;
}

interface DailyPlanPopupProps {
  open: boolean;
  items: DailyPlanItem[];
  selectedOffset: number;
  onSelectOffset: (offset: number) => void;
  onClose: () => void;
  title: string;
  subtitle: string;
  closeLabel: string;
  todayLabel: string;
  tomorrowLabel: string;
  futureDayLabel: (count: string) => string;
  phaseLabel: (args: { sprint: string; sprintDay: string; phaseLength: string }) => string;
  recoveryLabel: (args: { recoveryDay: string; days: string }) => string;
  tasksTitle: string;
  tasks: string[];
  formatter: Intl.NumberFormat;
  recoveryDays: number;
}

export function DailyPlanPopup({
  open,
  items,
  selectedOffset,
  onSelectOffset,
  onClose,
  title,
  subtitle,
  closeLabel,
  todayLabel,
  tomorrowLabel,
  futureDayLabel,
  phaseLabel,
  recoveryLabel,
  tasksTitle,
  tasks,
  formatter,
  recoveryDays
}: DailyPlanPopupProps) {
  if (!open || items.length === 0) return null;

  const activeItem = items.find((item) => item.offset === selectedOffset) ?? items[0];

  const dayButtonLabel = (offset: number) => {
    if (offset === 0) return todayLabel;
    if (offset === 1) return tomorrowLabel;
    return futureDayLabel(formatter.format(offset + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-card p-4 shadow-2xl md:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">{title}</h2>
            <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-600 bg-cardSoft px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
          >
            {closeLabel}
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {items.map((item) => {
            const active = item.offset === activeItem.offset;
            return (
              <button
                key={item.offset}
                onClick={() => onSelectOffset(item.offset)}
                className={`rounded-md px-3 py-1.5 text-xs transition ${
                  active ? "bg-ok/25 text-ok" : "bg-cardSoft text-slate-200 hover:bg-slate-700"
                }`}
              >
                {dayButtonLabel(item.offset)}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-cardSoft p-3 text-sm text-slate-200">
          <p className="text-xs text-slate-400">{activeItem.dateLabel}</p>
          <p className="mt-1">
            {phaseLabel({
              sprint: formatter.format(activeItem.sprintNumber),
              sprintDay: formatter.format(activeItem.sprintDayIndex),
              phaseLength: formatter.format(activeItem.phaseLength)
            })}
          </p>
          {activeItem.isRecovery ? (
            <p className="mt-1 text-xs text-warn">
              {recoveryLabel({
                recoveryDay: formatter.format(activeItem.recoveryDayIndex),
                days: formatter.format(recoveryDays)
              })}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{tasksTitle}</p>
          <ul className="grid gap-2 md:grid-cols-2">
            {tasks.map((task) => (
              <li key={task} className="rounded-lg bg-cardSoft px-3 py-2 text-sm text-slate-100">
                {task}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
