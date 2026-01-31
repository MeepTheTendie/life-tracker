<script lang="ts">
  import { TrendingUp, Flame, Target, Calendar, Award } from "lucide-svelte";
  import { fly } from "svelte/transition";
  import type { AnalyticsData } from "../../types";

  const { analytics } = $props<{ analytics: AnalyticsData[] }>();

  const totalHabits = $derived(analytics.length);
  const totalCompleted = $derived(analytics.reduce((sum, a) => sum + a.completedDays, 0));
  const avgCompletionRate = $derived(
    analytics.length > 0 
      ? Math.round(analytics.reduce((sum, a) => sum + a.completionRate, 0) / analytics.length)
      : 0
  );
  const bestStreak = $derived(
    Math.max(...analytics.map(a => a.currentStreak), 0)
  );

  function getDayLabel(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "narrow" });
  }
</script>

<div in:fly={{ y: 20 }} class="space-y-6">
  <!-- Summary Cards -->
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-rose-50 p-4 rounded-2xl border-2 border-rose-100">
      <div class="flex items-center gap-2 mb-2">
        <Target class="w-5 h-5 text-rose-500" />
        <span class="text-sm font-medium text-rose-700">Avg Rate</span>
      </div>
      <p class="text-3xl font-bold text-rose-800">{avgCompletionRate}%</p>
    </div>
    
    <div class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-100">
      <div class="flex items-center gap-2 mb-2">
        <Flame class="w-5 h-5 text-amber-500" />
        <span class="text-sm font-medium text-amber-700">Best Streak</span>
      </div>
      <p class="text-3xl font-bold text-amber-800">{bestStreak}</p>
    </div>
    
    <div class="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
      <div class="flex items-center gap-2 mb-2">
        <Calendar class="w-5 h-5 text-emerald-500" />
        <span class="text-sm font-medium text-emerald-700">Completed</span>
      </div>
      <p class="text-3xl font-bold text-emerald-800">{totalCompleted}</p>
    </div>
    
    <div class="bg-violet-50 p-4 rounded-2xl border-2 border-violet-100">
      <div class="flex items-center gap-2 mb-2">
        <Award class="w-5 h-5 text-violet-500" />
        <span class="text-sm font-medium text-violet-700">Habits</span>
      </div>
      <p class="text-3xl font-bold text-violet-800">{totalHabits}</p>
    </div>
  </div>

  <!-- Habit Analytics List -->
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
      <TrendingUp class="w-5 h-5" />
      Habit Performance
    </h3>
    
    {#if analytics.length === 0}
      <div class="text-center py-12 bg-gray-50 rounded-2xl">
        <p class="text-gray-500">No analytics data yet</p>
        <p class="text-sm text-gray-400">Start tracking habits to see your progress</p>
      </div>
    {:else}
      {#each analytics as habit (habit.habitId)}
        <div class="bg-white rounded-2xl border-2 border-gray-100 p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                style="background-color: {habit.color}"
              >
                <span class="text-white font-bold">{habit.habitName.charAt(0)}</span>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">{habit.habitName}</h4>
                <p class="text-xs text-gray-500">{habit.completionRate}% completion rate</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold" style="color: {habit.color}">{habit.currentStreak}</p>
              <p class="text-xs text-gray-400">day streak</p>
            </div>
          </div>

          <!-- Weekly Chart -->
          <div class="flex items-end gap-1 h-16">
            {#each habit.weeklyData as day (day.date)}
              <div class="flex-1 flex flex-col items-center gap-1">
                <div 
                  class="w-full rounded-t-md transition-all {day.completed ? 'opacity-100' : 'opacity-20'}"
                  style="height: {day.completed ? '100%' : '30%'}; background-color: {habit.color}"
                ></div>
                <span class="text-xs text-gray-400">{getDayLabel(day.date)}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
