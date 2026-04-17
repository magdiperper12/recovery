import { AppState, VersionedStorage } from "@/lib/types";
import { STORAGE_KEY } from "@/lib/logic";
import { createDefaultAppState, isValidAppState, migrateToLatest, STORAGE_VERSION } from "@/lib/migration";
import { buildExportPayload, downloadJson, getLastValidSnapshot, saveLastValidSnapshot } from "@/lib/backup";

export const safeParseJson = <T>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const readVersionedStorage = (): VersionedStorage<AppState> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { version: STORAGE_VERSION, data: createDefaultAppState() };
    }

    const parsed = safeParseJson<unknown>(raw);
    if (!parsed) {
      const snapshot = getLastValidSnapshot();
      return {
        version: STORAGE_VERSION,
        data: snapshot ?? createDefaultAppState()
      };
    }

    const migrated = migrateToLatest(parsed);
    saveLastValidSnapshot(migrated.data);
    return migrated;
  } catch {
    const snapshot = getLastValidSnapshot();
    return {
      version: STORAGE_VERSION,
      data: snapshot ?? createDefaultAppState()
    };
  }
};

export const writeVersionedStorage = (state: AppState): VersionedStorage<AppState> => {
  const wrapped: VersionedStorage<AppState> = {
    version: STORAGE_VERSION,
    data: { ...state, updatedAt: new Date().toISOString() }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapped));
  saveLastValidSnapshot(wrapped.data);
  return wrapped;
};

export const exportAppData = (state: AppState) => {
  const payload = buildExportPayload(state);
  const date = new Date().toISOString().slice(0, 10);
  downloadJson(`daily-checklist-backup-${date}.json`, payload);
};

export const importAppData = (rawText: string): { ok: true; state: AppState } | { ok: false; error: string } => {
  const parsed = safeParseJson<unknown>(rawText);
  if (!parsed) return { ok: false, error: "محتوى JSON غير صالح." };

  const candidate = (parsed as Record<string, unknown>).data ?? parsed;
  if (!isValidAppState(candidate)) {
    return { ok: false, error: "هيكل البيانات غير صالح." };
  }

  return { ok: true, state: candidate };
};

export const resetAppData = (): AppState => {
  const clean = createDefaultAppState();
  writeVersionedStorage(clean);
  return clean;
};
