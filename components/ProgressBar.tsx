"use client";

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full rounded-xl bg-cardSoft p-1">
      <div
        className={`h-3 rounded-lg transition-all ${
          value >= 80 ? "bg-ok" : value >= 50 ? "bg-warn" : "bg-bad"
        }`}
        style={{ width: `${Math.max(4, value)}%` }}
      />
    </div>
  );
}
