"use client";

import { TaskDefinition } from "@/lib/types";

interface ChecklistSectionProps {
  title: string;
  tasks: Array<TaskDefinition & { label: string }>;
  checks: Record<string, boolean>;
  onToggle: (taskId: string) => void;
  doneLabel: string;
  pendingLabel: string;
}

export function ChecklistSection({
  title,
  tasks,
  checks,
  onToggle,
  doneLabel,
  pendingLabel
}: ChecklistSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
      <div className="space-y-2">
        {tasks.map((task) => {
          const done = Boolean(checks[task.id]);
          return (
            <button
              key={task.id}
              onClick={() => onToggle(task.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-sm transition ${
                done ? "bg-green-950/40 text-green-200" : "bg-cardSoft text-slate-200 hover:bg-slate-700"
              }`}
            >
              <span>{task.label}</span>
              <span className={`rounded-md px-2 py-0.5 text-xs ${done ? "bg-ok/30 text-ok" : "bg-warn/20 text-warn"}`}>
                {done ? doneLabel : pendingLabel}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
