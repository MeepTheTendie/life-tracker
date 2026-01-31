import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getHabits = query({
  args: { includeArchived: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) => 
        q.eq("userId", userId).eq("isArchived", args.includeArchived ?? false)
      )
      .collect();

    return habits;
  },
});

export const getHabitById = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) return null;

    return habit;
  },
});

export const createHabit = mutation({
  args: {
    name: v.string(),
    category: v.union(
      v.literal("health"),
      v.literal("fitness"),
      v.literal("work"),
      v.literal("personal"),
      v.literal("relationships"),
      v.literal("mindfulness"),
      v.literal("learning"),
      v.literal("routine")
    ),
    trackingType: v.union(v.literal("boolean"), v.literal("numeric"), v.literal("duration"), v.literal("rating")),
    color: v.string(),
    icon: v.string(),
    weekDaysOnly: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("habits", {
      ...args,
      userId,
      isArchived: false,
      createdAt: Date.now(),
    });
  },
});

export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    name: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("health"),
      v.literal("fitness"),
      v.literal("work"),
      v.literal("personal"),
      v.literal("relationships"),
      v.literal("mindfulness"),
      v.literal("learning"),
      v.literal("routine")
    )),
    trackingType: v.optional(v.union(v.literal("boolean"), v.literal("numeric"), v.literal("duration"), v.literal("rating"))),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    weekDaysOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) throw new Error("Habit not found");

    const { habitId, ...updates } = args;
    await ctx.db.patch(habitId, updates);
    return habitId;
  },
});

export const archiveHabit = mutation({
  args: { habitId: v.id("habits"), isArchived: v.boolean() },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) throw new Error("Habit not found");

    await ctx.db.patch(args.habitId, { isArchived: args.isArchived });
    return args.habitId;
  },
});

export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) throw new Error("Habit not found");

    // Delete all entries for this habit
    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    await ctx.db.delete(args.habitId);
    return args.habitId;
  },
});
