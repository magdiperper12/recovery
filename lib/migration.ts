import { AppState, VersionedStorage } from "@/lib/types";
import { SYSTEM_START_DATE, createInitialState, hydrateAppState } from "@/lib/logic";

export const STORAGE_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidDayState = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return (
    typeof value.dateKey === "string" &&
    typeof value.startDate === "string" &&
    typeof value.dayNumber === "number" &&
    isRecord(value.checks) &&
    typeof value.note === "string" &&
    typeof value.badDay === "boolean" &&
    typeof value.relapse === "boolean"
  );
};

export const createDefaultAppState = (): AppState =>
  hydrateAppState({
    streak: 0,
    history: [],
    current: createInitialState(SYSTEM_START_DATE)
  });

export const isValidAppState = (value: unknown): value is AppState => {
  if (!isRecord(value)) return false;
  if (typeof value.streak !== "number") return false;
  if (!Array.isArray(value.history)) return false;
  if (!isValidDayState(value.current)) return false;
  return value.history.every((item) => isValidDayState(item));
};

export const migrateToLatest = (raw: unknown): VersionedStorage<AppState> => {
  if (!isRecord(raw)) {
    return { version: STORAGE_VERSION, data: createDefaultAppState() };
  }

  if ("version" in raw && "data" in raw) {
    const version = Number(raw.version);
    const data = raw.data;
    if (version === STORAGE_VERSION && isValidAppState(data)) {
      return { version: STORAGE_VERSION, data: hydrateAppState(data) };
    }
  }

  if (isValidAppState(raw)) {
    return { version: STORAGE_VERSION, data: hydrateAppState(raw) };
  }

  return { version: STORAGE_VERSION, data: createDefaultAppState() };
};
