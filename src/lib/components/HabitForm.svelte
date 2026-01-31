<script lang="ts">
  import { Plus, X } from "lucide-svelte";
  import { fly } from "svelte/transition";

  const { onClose } = $props<{ onClose: () => void }>();

  let name = $state("");
  let category = $state("routine");
  let trackingType = $state("boolean");
  let weekDaysOnly = $state(false);
  let saved = $state(false);

  const categories = ["health", "fitness", "work", "personal", "relationships", "mindfulness", "learning", "routine"];
  const trackingTypes = [
    { value: "boolean", label: "Yes/No" },
    { value: "numeric", label: "Number" },
    { value: "duration", label: "Duration" },
    { value: "rating", label: "Rating" },
  ];

  function handleSubmit() {
    if (!name.trim()) return;
    saved = true;
  }
</script>

<div in:fly={{ y: 20 }} class="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
  {#if saved}
    <div class="text-center py-8">
      <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Plus class="w-8 h-8 text-emerald-600" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Habit Saved!</h3>
      <p class="text-gray-500 mb-6">Your habit has been added to your list.</p>
      <button onclick={onClose} class="w-full p-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600">
        Continue
      </button>
    </div>
  {:else}
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Add New Habit</h2>
      <button onclick={onClose} class="p-2 hover:bg-gray-100 rounded-lg"><X class="w-5 h-5 text-gray-500" /></button>
    </div>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Habit Name</label>
        <input type="text" bind:value={name} placeholder="e.g., Morning Meditation" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div class="grid grid-cols-2 gap-2">
          {#each categories as cat}
            <button type="button" onclick={() => category = cat} class="p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all {category === cat ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}">{cat}</button>
          {/each}
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tracking Type</label>
        <div class="grid grid-cols-2 gap-2">
          {#each trackingTypes as type}
            <button type="button" onclick={() => trackingType = type.value} class="p-3 rounded-xl border-2 text-sm font-medium transition-all {trackingType === type.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}">{type.label}</button>
          {/each}
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <input type="checkbox" id="weekDaysOnly" bind:checked={weekDaysOnly} class="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-400" />
        <label for="weekDaysOnly" class="text-sm font-medium text-gray-700">Weekdays only (Mon-Fri)</label>
      </div>

      <button type="submit" disabled={!name.trim()} class="w-full flex items-center justify-center gap-2 p-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 disabled:opacity-50">
        <Plus class="w-5 h-5" />Add Habit
      </button>
    </form>
  {/if}
</div>
