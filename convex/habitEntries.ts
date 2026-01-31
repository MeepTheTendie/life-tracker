import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getEntries = query({
  args: { 
    habitId: v.optional(v.id("habits")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    if (args.habitId) {
      // Get entries for a specific habit
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== userId) return [];

      let query = ctx.db
        .query("habitEntries")
        .withIndex("by_habit_date", (q) => q.eq("habitId", args.habitId));

      if (args.startDate && args.endDate) {
        query = query.filter((q) => 
          q.and(
            q.gte(q.field("date"), args.startDate!),
            q.lte(q.field("date"), args.endDate!)
          )
        );
      }

      return await query.order("desc").collect();
    } else {
      // Get all entries for user in date range
      let query = ctx.db
        .query("habitEntries")
        .withIndex("by_user_date", (q) => q.eq("userId", userId));

      if (args.startDate && args.endDate) {
        query = query.filter((q) => 
          q.and(
            q.gte(q.field("date"), args.startDate!),
            q.lte(q.field("date"), args.endDate!)
          )
        );
      }

      return await query.order("desc").collect();
    }
  },
});

export const getTodayEntries = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("date"), args.date))
      .collect();

    return entries;
  },
});

export const createEntry = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
    completed: v.boolean(),
    value: v.optional(v.number()),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) throw new Error("Habit not found");

    // Check if entry already exists for this habit and date
    const existing = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit_date", (q) => 
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: args.completed,
        value: args.value,
        rating: args.rating,
        notes: args.notes,
        duration: args.duration,
      });
      return existing._id;
    }

    return await ctx.db.insert("habitEntries", {
      ...args,
      userId,
    });
  },
});

export const updateEntry = mutation({
  args: {
    entryId: v.id("habitEntries"),
    completed: v.optional(v.boolean()),
    value: v.optional(v.number()),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) throw new Error("Entry not found");

    const { entryId, ...updates } = args;
    await ctx.db.patch(entryId, updates);
    return entryId;
  },
});

export const toggleHabitEntry = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) throw new Error("Habit not found");

    const existing = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit_date", (q) => 
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: !existing.completed,
      });
      return existing._id;
    }

    return await ctx.db.insert("habitEntries", {
      habitId: args.habitId,
      userId,
      date: args.date,
      completed: true,
    });
  },
});
