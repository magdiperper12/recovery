import { MotivationMessage, SprintPlan, TaskDefinition } from "@/lib/types";

export const TASKS: TaskDefinition[] = [
  { id: "wake_6", labelKey: "tasks.wake_6", category: "morning" },
  { id: "fajr", labelKey: "tasks.fajr", category: "morning" },
  { id: "gym", labelKey: "tasks.gym", category: "morning" },
  { id: "work", labelKey: "tasks.work", category: "work" },
  { id: "backend_2h", labelKey: "tasks.backend_2h", category: "deepWork" },
  { id: "frontend_1h", labelKey: "tasks.frontend_1h", category: "deepWork" },
  { id: "jobs", labelKey: "tasks.jobs", category: "growth" },
  { id: "no_porn", labelKey: "tasks.no_porn", category: "discipline" },
  { id: "reflect", labelKey: "tasks.reflect", category: "night" },
  { id: "sleep_1130", labelKey: "tasks.sleep_1130", category: "night" }
];

const sprintTemplate = (sprintNumber: number): SprintPlan => {
  const startDay = (sprintNumber - 1) * 15 + 1;
  const endDay = sprintNumber * 15;

  return {
    sprintNumber,
    startDay,
    endDay
  };
};

export const SPRINTS: SprintPlan[] = Array.from({ length: 8 }, (_, i) =>
  sprintTemplate(i + 1)
);

export const MOTIVATION_MESSAGES: MotivationMessage[] = [
  { min: 0, max: 39, message: "motivation.low" },
  { min: 40, max: 69, message: "motivation.mid" },
  { min: 70, max: 89, message: "motivation.high" },
  { min: 90, max: 100, message: "motivation.elite" }
];
