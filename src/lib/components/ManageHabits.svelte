<script lang="ts">
  import { Archive, Trash2, RotateCcw, Loader2 } from "lucide-svelte";
  import { fly } from "svelte/transition";
  import type { Habit } from "../../types";

  const { habits, archivedHabits, onArchive, onDelete, onRestore, loading } = $props<{
    habits: Habit[];
    archivedHabits: Habit[];
    onArchive: (habitId: string, isArchived: boolean) => void;
    onDelete: (habitId: string) => void;
    onRestore: (habitId: string) => void;
    loading: boolean;
  }>();

  let activeTab = $state<"active" | "archived">("active");
</script>

<div in:fly={{ y: 20 }} class="space-y-6">
  <!-- Tabs -->
  <div class="flex gap-2 p-1 bg-gray-100 rounded-xl">
    <button
      onclick={() => activeTab = "active"}
      class="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all
        {activeTab === 'active' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
    >
      Active ({habits.length})
    </button>
    <button
      onclick={() => activeTab = "archived"}
      class="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all
        {activeTab === 'archived' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
    >
      Archived ({archivedHabits.length})
    </button>
  </div>

  <!-- Active Habits -->
  {#if activeTab === "active"}
    <div class="space-y-3">
      {#if habits.length === 0}
        <div class="text-center py-12 bg-gray-50 rounded-2xl">
          <p class="text-gray-500">No active habits</p>
        </div>
      {:else}
        {#each habits as habit (habit._id)}
          <div 
            class="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                style="background-color: {habit.color}"
              >
                <span class="text-white font-bold text-lg">{habit.name.charAt(0)}</span>
              </div>
              <div>
                <h3 class="font-bold text-gray-800">{habit.name}</h3>
                <p class="text-xs text-gray-500 capitalize">{habit.category}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                onclick={() => onArchive(habit._id, true)}
                disabled={loading}
                class="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              >
                {#if loading}
                  <Loader2 class="w-5 h-5 animate-spin" />
                {:else}
                  <Archive class="w-5 h-5" />
                {/if}
              </button>
              <button
                onclick={() => onDelete(habit._id)}
                disabled={loading}
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                {#if loading}
                  <Loader2 class="w-5 h-5 animate-spin" />
                {:else}
                  <Trash2 class="w-5 h-5" />
                {/if}
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}

  <!-- Archived Habits -->
  {#if activeTab === "archived"}
    <div class="space-y-3">
      {#if archivedHabits.length === 0}
        <div class="text-center py-12 bg-gray-50 rounded-2xl">
          <p class="text-gray-500">No archived habits</p>
        </div>
      {:else}
        {#each archivedHabits as habit (habit._id)}
          <div 
            class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 opacity-70"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                style="background-color: {habit.color}"
              >
                <span class="text-white font-bold text-lg">{habit.name.charAt(0)}</span>
              </div>
              <div>
                <h3 class="font-bold text-gray-600">{habit.name}</h3>
                <p class="text-xs text-gray-400 capitalize">{habit.category} • Archived</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                onclick={() => onRestore(habit._id)}
                disabled={loading}
                class="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {#if loading}
                  <Loader2 class="w-5 h-5 animate-spin" />
                {:else}
                  <RotateCcw class="w-5 h-5" />
                {/if}
              </button>
              <button
                onclick={() => onDelete(habit._id)}
                disabled={loading}
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                {#if loading}
                  <Loader2 class="w-5 h-5 animate-spin" />
                {:else}
                  <Trash2 class="w-5 h-5" />
                {/if}
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
