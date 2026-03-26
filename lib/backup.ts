import { AppState } from "@/lib/types";

export const LAST_VALID_SNAPSHOT_KEY = "daily-checklist-last-valid-snapshot-v1";

export const saveLastValidSnapshot = (state: AppState) => {
  try {
    localStorage.setItem(LAST_VALID_SNAPSHOT_KEY, JSON.stringify(state));
  } catch {
    // Keep app running if storage quota fails
  }
};

export const getLastValidSnapshot = (): AppState | null => {
  try {
    const raw = localStorage.getItem(LAST_VALID_SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
};

export const buildExportPayload = (state: AppState) => ({
  exportedAt: new Date().toISOString(),
  source: "daily-checklist-system",
  data: state
});

export const downloadJson = (filename: string, payload: unknown) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
