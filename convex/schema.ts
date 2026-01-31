import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  habits: defineTable({
    userId: v.id("users"),
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
    isArchived: v.boolean(),
    weekDaysOnly: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_archived", ["userId", "isArchived"]),

  habitEntries: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(),
    completed: v.boolean(),
    value: v.optional(v.number()),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
    duration: v.optional(v.number()),
  })
    .index("by_habit_date", ["habitId", "date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_habit", ["habitId"]),
});
