import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const defaultHabits = [
  { name: "Prayer", category: "mindfulness", icon: "Sparkles", color: "#C5A5CF", weekDaysOnly: false, trackingType: "boolean" },
  { name: "Calls", category: "relationships", icon: "Phone", color: "#9DC88D", weekDaysOnly: false, trackingType: "duration" },
  { name: "Daily Bath", category: "routine", icon: "Bath", color: "#B8B8D1", weekDaysOnly: false, trackingType: "boolean" },
  { name: "Bible Reading", category: "mindfulness", icon: "BookOpen", color: "#C5A5CF", weekDaysOnly: false, trackingType: "duration" },
];

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new Error("User must be authenticated to seed habits");
    }

    const existingHabits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const existingNames = new Set(existingHabits.map((h) => h.name));
    const habitsToCreate = defaultHabits.filter((h) => !existingNames.has(h.name));

    for (const habit of habitsToCreate) {
      await ctx.db.insert("habits", {
        ...habit,
        userId,
        isArchived: false,
        createdAt: Date.now(),
      });
    }

    return { created: habitsToCreate.length, skipped: existingNames.size };
  },
});
