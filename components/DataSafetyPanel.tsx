"use client";

import { ChangeEvent, useRef, useState } from "react";

interface DataSafetyPanelProps {
  onExport: () => void;
  onImport: (rawText: string) => boolean;
  onReset: () => void;
  error: string | null;
  clearError: () => void;
}

export function DataSafetyPanel({
  onExport,
  onImport,
  onReset,
  error,
  clearError
}: DataSafetyPanelProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const ok = onImport(text);
    if (ok && fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const canReset = confirmText.trim().toUpperCase() === "RESET";

  return (
    <section className="rounded-2xl border border-slate-700 bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">أمان البيانات</h3>
      <div className="flex flex-wrap gap-2">
        <button onClick={onExport} className="rounded-lg bg-cardSoft px-3 py-2 text-sm text-slate-200">
          تصدير JSON
        </button>
        <label className="rounded-lg bg-cardSoft px-3 py-2 text-sm text-slate-200">
          استيراد JSON
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </label>
      </div>
      <div className="mt-4 rounded-lg bg-slate-900 p-3">
        <p className="mb-2 text-xs text-slate-400">اكتب RESET لتأكيد إعادة الضبط</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
            placeholder="RESET"
          />
          <button
            disabled={!canReset}
            onClick={onReset}
            className="rounded-md bg-bad/20 px-3 py-1 text-sm text-bad disabled:cursor-not-allowed disabled:opacity-50"
          >
            إعادة ضبط كل البيانات
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-bad/20 px-3 py-2 text-xs text-bad">
          <span>{error}</span>
          <button onClick={clearError} className="underline">
            إغلاق
          </button>
        </div>
      )}
    </section>
  );
}
