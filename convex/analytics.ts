import { query } from "./_generated/server";
import { v } from "convex/values";

export const getHabitAnalytics = query({
  args: { 
    habitId: v.id("habits"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId) return null;

    const days = args.days ?? 30;
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit_date", (q) => 
        q.eq("habitId", args.habitId)
      )
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .order("desc")
      .collect();

    // Calculate completion rate
    const completedDays = entries.filter(e => e.completed).length;
    const completionRate = entries.length > 0 ? (completedDays / entries.length) * 100 : 0;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    
    for (const entry of sortedEntries) {
      if (entry.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak from today backwards
    const today = new Date().toISOString().split("T")[0];
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const entry = entries.find(e => e.date === date);
      
      if (entry?.completed) {
        currentStreak++;
      } else if (date !== today || entry?.completed === false) {
        break;
      }
    }

    // Weekly data for charts
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const entry = entries.find(e => e.date === date);
      weeklyData.push({
        date,
        completed: entry?.completed ?? false,
        value: entry?.value,
      });
    }

    return {
      habitId: habit._id,
      habitName: habit.name,
      category: habit.category,
      color: habit.color,
      totalDays: entries.length,
      completedDays,
      completionRate: Math.round(completionRate),
      currentStreak,
      longestStreak,
      weeklyData,
    };
  },
});

export const getAllAnalytics = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) => 
        q.eq("userId", userId).eq("isArchived", false)
      )
      .collect();

    const days = args.days ?? 30;
    const analytics = [];

    for (const habit of habits) {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const entries = await ctx.db
        .query("habitEntries")
        .withIndex("by_habit_date", (q) => 
          q.eq("habitId", habit._id)
        )
        .filter((q) => 
          q.and(
            q.gte(q.field("date"), startDate),
            q.lte(q.field("date"), endDate)
          )
        )
        .collect();

      const completedDays = entries.filter(e => e.completed).length;
      const completionRate = entries.length > 0 ? (completedDays / entries.length) * 100 : 0;

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
      
      for (const entry of sortedEntries) {
        if (entry.completed) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Current streak
      const today = new Date().toISOString().split("T")[0];
      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const entry = entries.find(e => e.date === date);
        
        if (entry?.completed) {
          currentStreak++;
        } else if (date !== today || entry?.completed === false) {
          break;
        }
      }

      // Weekly data
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const entry = entries.find(e => e.date === date);
        weeklyData.push({
          date,
          completed: entry?.completed ?? false,
          value: entry?.value,
        });
      }

      analytics.push({
        habitId: habit._id,
        habitName: habit.name,
        category: habit.category,
        color: habit.color,
        totalDays: entries.length,
        completedDays,
        completionRate: Math.round(completionRate),
        currentStreak,
        longestStreak,
        weeklyData,
      });
    }

    return analytics;
  },
});

export const getCategoryBreakdown = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = ctx.auth?.userId;
    if (!userId) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) => 
        q.eq("userId", userId).eq("isArchived", false)
      )
      .collect();

    const days = args.days ?? 30;
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const categoryStats: Record<string, { total: number; completed: number; color: string }> = {};

    for (const habit of habits) {
      const entries = await ctx.db
        .query("habitEntries")
        .withIndex("by_habit_date", (q) => 
          q.eq("habitId", habit._id)
        )
        .filter((q) => 
          q.and(
            q.gte(q.field("date"), startDate),
            q.lte(q.field("date"), endDate)
          )
        )
        .collect();

      const completed = entries.filter(e => e.completed).length;
      
      if (!categoryStats[habit.category]) {
        categoryStats[habit.category] = { total: 0, completed: 0, color: habit.color };
      }
      
      categoryStats[habit.category].total += entries.length;
      categoryStats[habit.category].completed += completed;
    }

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      total: stats.total,
      completed: stats.completed,
      rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      color: stats.color,
    }));
  },
});
