<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { anyApi } from "convex/server";
  import { Check, Loader2, Trophy, Sparkles, Phone, Bath, BookOpen } from "lucide-svelte";
  import { fly, scale } from "svelte/transition";
  import type { HabitCategory } from "../../types";

  const api = anyApi;

  const { habit, dateStr, todayEntry, onToggle } = $props<{
    habit: {
      _id: string;
      name: string;
      category: HabitCategory;
      color: string;
      icon: string;
    };
    dateStr: string;
    todayEntry?: { completed: boolean } | null;
    onToggle: (habitId: string) => void;
  }>();

  let isLoading = $state(false);
  const isCompleted = $derived(todayEntry?.completed ?? false);

  const iconMap: Record<string, any> = {
    Sparkles,
    Phone,
    Bath,
    BookOpen,
  };

  const IconComponent = $derived(iconMap[habit.icon] ?? Sparkles);

  async function handleToggle() {
    isLoading = true;
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
    
    onToggle(habit._id);
    
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
    isLoading = false;
  }
</script>

<button
  onclick={handleToggle}
  class="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 mb-3
    {isCompleted 
      ? 'bg-opacity-30' 
      : 'bg-white hover:bg-opacity-50'}
    {isLoading ? 'opacity-60 cursor-wait' : ''}"
  style="background-color: {isCompleted ? habit.color : 'white'}; border-color: {habit.color}"
>
  <div class="flex items-center gap-4">
    <div 
      class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
      style="background-color: {habit.color}"
    >
      <IconComponent class="w-6 h-6 text-white" />
    </div>
    <div class="text-left">
      <span class="font-bold text-lg {isCompleted ? 'text-gray-800' : 'text-gray-700'}">
        {habit.name}
      </span>
      <p class="text-xs text-gray-500 capitalize">{habit.category}</p>
    </div>
  </div>
  
  <div class="flex items-center gap-3">
    {#if isLoading}
      <Loader2 class="w-6 h-6 text-gray-400 animate-spin" />
    {:else if isCompleted}
      <div 
        in:scale={{ duration: 200 }}
        class="w-10 h-10 rounded-full flex items-center justify-center"
        style="background-color: {habit.color}"
      >
        <Check class="w-6 h-6 text-white" />
      </div>
    {:else}
      <div class="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
        <div class="w-5 h-5 rounded-full bg-gray-200"></div>
      </div>
    {/if}
  </div>
</button>
