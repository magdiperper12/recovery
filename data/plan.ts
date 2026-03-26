import { MotivationMessage, SprintPlan, TaskDefinition } from "@/lib/types";

export const TASKS: TaskDefinition[] = [
  { id: "wake_6", labelKey: "tasks.wake_6", category: "morning" },
  { id: "fajr", labelKey: "tasks.fajr", category: "morning" },
  { id: "gym", labelKey: "tasks.gym", category: "morning" },
  { id: "breakfast", labelKey: "tasks.breakfast", category: "morning" },
  { id: "work", labelKey: "tasks.work", category: "work" },
  { id: "focus", labelKey: "tasks.focus", category: "work" },
  { id: "backend_2h", labelKey: "tasks.backend_2h", category: "deepWork" },
  { id: "frontend_1h", labelKey: "tasks.frontend_1h", category: "deepWork" },
  { id: "jobs", labelKey: "tasks.jobs", category: "growth" },
  { id: "freelance", labelKey: "tasks.freelance", category: "growth" },
  { id: "no_porn", labelKey: "tasks.no_porn", category: "discipline" },
  { id: "no_masturbation", labelKey: "tasks.no_masturbation", category: "discipline" },
  { id: "social_limit", labelKey: "tasks.social_limit", category: "discipline" },
  { id: "reflect", labelKey: "tasks.reflect", category: "night" },
  { id: "track", labelKey: "tasks.track", category: "night" },
  { id: "sleep_1130", labelKey: "tasks.sleep_1130", category: "night" }
];

const sprintTemplate = (sprintNumber: number): SprintPlan => {
  const startDays = [1, 19, 37, 55, 73, 91, 109];
  const endDays = [15, 33, 51, 69, 87, 105, 120];
  const startDay = startDays[sprintNumber - 1];
  const endDay = endDays[sprintNumber - 1];

  return {
    sprintNumber,
    startDay,
    endDay
  };
};

export const SPRINTS: SprintPlan[] = Array.from({ length: 7 }, (_, i) =>
  sprintTemplate(i + 1)
);

export const MOTIVATION_MESSAGES: MotivationMessage[] = [
  { min: 0, max: 39, message: "motivation.low" },
  { min: 40, max: 69, message: "motivation.mid" },
  { min: 70, max: 89, message: "motivation.high" },
  { min: 90, max: 100, message: "motivation.elite" }
];
