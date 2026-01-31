import type { Doc } from "./_generated/dataModel";

export type Habit = Doc<"habits">;
export type HabitEntry = Doc<"habitEntries">;

export type HabitCategory = 
  | "health" 
  | "fitness" 
  | "work" 
  | "personal" 
  | "relationships" 
  | "mindfulness" 
  | "learning" 
  | "routine";

export type TrackingType = "boolean" | "numeric" | "duration" | "rating";

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: "#E8B4B8",
  fitness: "#A8D8EA",
  work: "#F5E6D3",
  personal: "#D4A5A5",
  relationships: "#9DC88D",
  mindfulness: "#C5A5CF",
  learning: "#FFD93D",
  routine: "#B8B8D1",
};

export const CATEGORY_ICONS: Record<HabitCategory, string> = {
  health: "Heart",
  fitness: "Dumbbell",
  work: "Briefcase",
  personal: "User",
  relationships: "Users",
  mindfulness: "Brain",
  learning: "BookOpen",
  routine: "Calendar",
};

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: "Health",
  fitness: "Fitness",
  work: "Work",
  personal: "Personal",
  relationships: "Relationships",
  mindfulness: "Mindfulness",
  learning: "Learning",
  routine: "Routine",
};

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[];
  todayEntry?: HabitEntry;
}

export interface AnalyticsData {
  habitId: string;
  habitName: string;
  category: HabitCategory;
  color: string;
  totalDays: number;
  completedDays: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  weeklyData: {
    date: string;
    completed: boolean;
    value?: number;
  }[];
}
