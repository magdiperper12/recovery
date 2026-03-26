export type TaskCategory =
  | "morning"
  | "work"
  | "deepWork"
  | "growth"
  | "discipline"
  | "night";

export interface TaskDefinition {
  id: string;
  labelKey: string;
  category: TaskCategory;
}

export interface DayState {
  dateKey: string;
  startDate: string;
  dayNumber: number;
  checks: Record<string, boolean>;
  note: string;
  badDay: boolean;
  relapse: boolean;
  weightKg?: number;
  income?: number;
}

export interface AppState {
  streak: number;
  history: DayState[];
  current: DayState;
  goalProgressHistory?: GoalProgressHistory;
  dayProgressHistory?: DayProgressHistory;
  phaseProgressHistory?: PhaseProgressHistory;
  updatedAt?: string;
}

export interface SprintPlan {
  sprintNumber: number;
  startDay: number;
  endDay: number;
}

export interface MotivationMessage {
  min: number;
  max: number;
  message: string;
}

export type GoalId =
  | "income"
  | "weight"
  | "quitAddiction"
  | "varicocele"
  | "backend"
  | "frontendSenior";

export type GoalProgressHistory = Record<string, Record<GoalId, number>>;
export type DayProgressHistory = Record<string, number>;
export type PhaseProgressHistory = Record<string, number>;

export interface VersionedStorage<T> {
  version: number;
  data: T;
}
