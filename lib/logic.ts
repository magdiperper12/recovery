import { TASKS } from "@/data/plan";
import {
  AppState,
  DayProgressHistory,
  DayState,
  GoalId,
  GoalProgressHistory,
  PhaseProgressHistory
} from "@/lib/types";

export const STORAGE_KEY = "daily-checklist-system-v1";
export const PLAN_LENGTH_DAYS = 120;
export const PHASE_LENGTHS = [15, 15, 15, 15, 15, 15, 12] as const;
export const RECOVERY_DAYS = 3;
export const TRACKING_START_DATE_KEY = "2026-03-27";
export const SYSTEM_START_DATE = new Date("2026-03-27T00:00:00");
export const GOAL_IDS: GoalId[] = [
  "income",
  "weight",
  "quitAddiction",
  "varicocele",
  "backend",
  "frontendSenior"
];

export const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

export const getDefaultChecks = () =>
  Object.fromEntries(TASKS.map((task) => [task.id, false])) as Record<string, boolean>;

export const createInitialState = (startDate: Date = SYSTEM_START_DATE): DayState => ({
  dateKey: getDateKey(),
  startDate: startDate.toISOString(),
  dayNumber: getCurrentDayNumber(startDate.toISOString()),
  checks: getDefaultChecks(),
  note: "",
  badDay: false,
  relapse: false
});

export const getCurrentDayNumber = (startDateIso: string, today = new Date()) => {
  const start = new Date(startDateIso);
  const ms = today.getTime() - start.getTime();
  const rawDay = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(rawDay, 1), PLAN_LENGTH_DAYS);
};

export interface PhaseContext {
  phaseNumber: number;
  phaseDayIndex: number;
  phaseLength: number;
  isRecovery: boolean;
  recoveryDayIndex: number;
}

export const getPhaseContext = (dayNumber: number): PhaseContext => {
  const day = Math.min(Math.max(dayNumber, 1), PLAN_LENGTH_DAYS);
  let cursor = 1;

  for (let i = 0; i < PHASE_LENGTHS.length; i += 1) {
    const phaseLength = PHASE_LENGTHS[i];
    const workStart = cursor;
    const workEnd = cursor + phaseLength - 1;
    if (day >= workStart && day <= workEnd) {
      return {
        phaseNumber: i + 1,
        phaseDayIndex: day - workStart + 1,
        phaseLength,
        isRecovery: false,
        recoveryDayIndex: 0
      };
    }

    cursor = workEnd + 1;

    const hasRecovery = i < PHASE_LENGTHS.length - 1;
    if (hasRecovery) {
      const recoveryStart = cursor;
      const recoveryEnd = cursor + RECOVERY_DAYS - 1;
      if (day >= recoveryStart && day <= recoveryEnd) {
        return {
          phaseNumber: i + 1,
          phaseDayIndex: phaseLength,
          phaseLength,
          isRecovery: true,
          recoveryDayIndex: day - recoveryStart + 1
        };
      }
      cursor = recoveryEnd + 1;
    }
  }

  const finalLength = PHASE_LENGTHS[PHASE_LENGTHS.length - 1];
  return {
    phaseNumber: PHASE_LENGTHS.length,
    phaseDayIndex: finalLength,
    phaseLength: finalLength,
    isRecovery: false,
    recoveryDayIndex: 0
  };
};

export const getSprintNumber = (dayNumber: number) => getPhaseContext(dayNumber).phaseNumber;

export const getSprintDayIndex = (dayNumber: number) => getPhaseContext(dayNumber).phaseDayIndex;

export const getPhaseLength = (dayNumber: number) => getPhaseContext(dayNumber).phaseLength;

export const isRecoveryDay = (dayNumber: number) => getPhaseContext(dayNumber).isRecovery;

export const computeProgress = (checks: Record<string, boolean>) => {
  const completed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
};

export const computeDisciplineScore = (
  checks: Record<string, boolean>,
  relapse: boolean,
  badDay: boolean
) => {
  const { percent } = computeProgress(checks);
  const disciplineTasks = ["no_porn", "no_masturbation", "social_limit"];
  const disciplineHits = disciplineTasks.reduce(
    (sum, id) => sum + (checks[id] ? 1 : 0),
    0
  );
  const disciplineBonus = Math.round((disciplineHits / disciplineTasks.length) * 20);
  const relapsePenalty = relapse ? 40 : 0;
  const honestyPenalty = badDay ? 10 : 0;
  return Math.min(Math.max(percent + disciplineBonus - relapsePenalty - honestyPenalty, 0), 100);
};

export const shouldIncreaseStreak = (
  checks: Record<string, boolean>,
  relapse: boolean
) => {
  const { percent } = computeProgress(checks);
  return !relapse && percent >= 80;
};

const goalProgressChecks = (goalId: GoalId, day: DayState): Record<string, boolean> => {
  const c = day.checks;
  const hasNotes = day.note.trim().length > 0;

  switch (goalId) {
    case "income":
      return {
        jobs: Boolean(c.jobs),
        freelance: Boolean(c.freelance),
        focus: Boolean(c.focus),
        track: Boolean(c.track)
      };
    case "weight":
      return {
        gym: Boolean(c.gym),
        breakfast: Boolean(c.breakfast),
        sleep: Boolean(c.sleep_1130),
        reflect: Boolean(c.reflect)
      };
    case "quitAddiction":
      return {
        noPorn: Boolean(c.no_porn),
        noMasturbation: Boolean(c.no_masturbation),
        socialLimit: Boolean(c.social_limit),
        noRelapse: !day.relapse
      };
    case "varicocele":
      return {
        reflect: Boolean(c.reflect),
        track: Boolean(c.track),
        sleep: Boolean(c.sleep_1130),
        notes: hasNotes
      };
    case "backend":
      return {
        backendStudy: Boolean(c.backend_2h),
        focus: Boolean(c.focus),
        track: Boolean(c.track),
        noDistraction: Boolean(c.work)
      };
    case "frontendSenior":
      return {
        frontendStudy: Boolean(c.frontend_1h),
        focus: Boolean(c.focus),
        track: Boolean(c.track),
        reflection: Boolean(c.reflect)
      };
    default:
      return {};
  }
};

export const computeGoalProgressForDay = (day: DayState): Record<GoalId, number> =>
  Object.fromEntries(
    GOAL_IDS.map((goalId) => [goalId, computeProgress(goalProgressChecks(goalId, day)).percent])
  ) as Record<GoalId, number>;

export const buildGoalProgressHistory = (
  days: DayState[],
  startDateKey = TRACKING_START_DATE_KEY
): GoalProgressHistory => {
  const filtered = days
    .filter((day) => day.dateKey >= startDateKey)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return Object.fromEntries(
    filtered.map((day) => [day.dateKey, computeGoalProgressForDay(day)])
  ) as GoalProgressHistory;
};

export const computeGoalAggregateProgress = (
  goalId: GoalId,
  history: GoalProgressHistory
): number => {
  const dates = Object.keys(history);
  if (dates.length === 0) return 0;
  const sum = dates.reduce((acc, dateKey) => acc + (history[dateKey]?.[goalId] ?? 0), 0);
  return Math.round(sum / dates.length);
};

export const hydrateAppState = (state: AppState): AppState => {
  const allDays = [...(state.history ?? []), state.current];
  return {
    ...state,
    history: state.history ?? [],
    current: state.current,
    goalProgressHistory: buildGoalProgressHistory(allDays, TRACKING_START_DATE_KEY),
    dayProgressHistory: buildDailyProgressHistory(allDays, TRACKING_START_DATE_KEY),
    phaseProgressHistory: buildPhaseProgressHistory(allDays, TRACKING_START_DATE_KEY),
    updatedAt: new Date().toISOString()
  };
};

export const buildDailyProgressHistory = (
  days: DayState[],
  startDateKey = TRACKING_START_DATE_KEY
): DayProgressHistory => {
  const filtered = days
    .filter((day) => day.dateKey >= startDateKey)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  return Object.fromEntries(
    filtered.map((day) => [day.dateKey, computeProgress(day.checks).percent])
  ) as DayProgressHistory;
};

export const buildPhaseProgressHistory = (
  days: DayState[],
  startDateKey = TRACKING_START_DATE_KEY
): PhaseProgressHistory => {
  const filtered = days.filter((day) => day.dateKey >= startDateKey);
  const accum: Record<string, { sum: number; count: number }> = {};

  filtered.forEach((day) => {
    const phase = getSprintNumber(day.dayNumber).toString();
    const percent = computeProgress(day.checks).percent;
    if (!accum[phase]) accum[phase] = { sum: 0, count: 0 };
    accum[phase].sum += percent;
    accum[phase].count += 1;
  });

  return Object.fromEntries(
    Object.entries(accum).map(([phase, value]) => [phase, Math.round(value.sum / value.count)])
  ) as PhaseProgressHistory;
};
