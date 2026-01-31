<script lang="ts">
  import { Plus, Check, TrendingUp } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import HabitForm from "./HabitForm.svelte";

  const DEMO_HABITS = [
    { _id: "1", name: "Prayer", category: "Faith", color: "#E8B4B8", icon: "🙏" },
    { _id: "2", name: "Bible Reading", category: "Faith", color: "#A8D5BA", icon: "📖" },
    { _id: "3", name: "Daily Bath", category: "Health", color: "#F4E3AC", icon: "🛁" },
    { _id: "4", name: "Calls", category: "Relationships", color: "#7A8B8F", icon: "📞" },
    { _id: "5", name: "Exercise", category: "Fitness", color: "#E8B4B8", icon: "💪" },
    { _id: "6", name: "Reading", category: "Learning", color: "#A8D5BA", icon: "📚" },
  ];

  let habits = $state(DEMO_HABITS);
  let completed = $state<Set<string>>(new Set());
  let showAddForm = $state(false);

  const { dateStr } = $props<{ dateStr: string }>();

  function toggleHabit(id: string) {
    if (completed.has(id)) {
      completed.delete(id);
    } else {
      completed.add(id);
    }
    completed = new Set(completed);
    if ("vibrate" in navigator) navigator.vibrate([15, 30]);
  }

  const progress = $derived(habits.length > 0 ? (completed.size / habits.length) * 100 : 0);
</script>

<div class="space-y-6">
  <div class="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-rose-500" />
        <h2 class="font-bold text-gray-800">Today's Progress</h2>
      </div>
      <span class="text-sm font-bold text-rose-600">{completed.size}/{habits.length}</span>
    </div>
    <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
      <div class="bg-rose-400 h-full transition-all duration-500" style="width: {progress}%"></div>
    </div>
    {#if completed.size === habits.length && habits.length > 0}
      <p class="text-center text-emerald-600 font-medium mt-3">All habits complete! 🎉</p>
    {/if}
  </div>

  <button onclick={() => showAddForm = true} class="w-full flex items-center justify-center gap-2 p-4 bg-rose-100 text-rose-700 rounded-2xl border-2 border-rose-200 hover:bg-rose-200">
    <Plus class="w-5 h-5" /><span class="font-semibold">Add New Habit</span>
  </button>

  <div class="space-y-3">
    {#each habits as habit (habit._id)}
      {@const isDone = completed.has(habit._id)}
      <button onclick={() => toggleHabit(habit._id)} class="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all {isDone ? 'bg-opacity-30' : 'bg-white hover:bg-opacity-50'}" style="background-color: {isDone ? habit.color : 'white'}; border-color: {habit.color}">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background-color: {habit.color}">
            <span class="text-2xl">{habit.icon}</span>
          </div>
          <div class="text-left">
            <span class="font-bold text-lg {isDone ? 'text-gray-800' : 'text-gray-700'}">{habit.name}</span>
            <p class="text-xs text-gray-500 capitalize">{habit.category}</p>
          </div>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center {isDone ? '' : 'border-2 border-gray-300'}">
          {#if isDone}<Check class="w-6 h-6 text-white" />{/if}
        </div>
      </button>
    {/each}
  </div>
</div>

{#if showAddForm}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" transition:fade>
    <div class="bg-white rounded-2xl p-6 w-full max-w-md"><HabitForm onClose={() => showAddForm = false} /></div>
  </div>
{/if}
