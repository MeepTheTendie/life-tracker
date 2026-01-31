<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { anyApi } from "convex/server";
  import { ManageHabits } from "$components";

  const api = anyApi;
  const client = createConvexClient();

  let habits = $state<any[]>([]);
  let archivedHabits = $state<any[]>([]);
  let loading = $state(false);

  $effect(() => {
    async function fetchHabits() {
      try {
        const [activeResult, archivedResult] = await Promise.all([
          client.query(api.habits.getHabits, { includeArchived: false }),
          client.query(api.habits.getHabits, { includeArchived: true }),
        ]);
        habits = activeResult || [];
        archivedHabits = (archivedResult || []).filter((h: any) => h.isArchived);
      } catch (error) {
        console.error("Failed to fetch habits:", error);
      }
    }
    fetchHabits();
  });

  async function handleArchive(habitId: string, isArchived: boolean) {
    loading = true;
    await client.mutation(api.habits.archiveHabit, { habitId, isArchived });
    loading = false;
  }

  async function handleDelete(habitId: string) {
    if (!confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
      return;
    }
    loading = true;
    await client.mutation(api.habits.deleteHabit, { habitId });
    loading = false;
  }

  async function handleRestore(habitId: string) {
    loading = true;
    await client.mutation(api.habits.archiveHabit, { habitId, isArchived: false });
    loading = false;
  }
</script>

<svelte:head>
  <title>Life Tracker - Manage Habits</title>
</svelte:head>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Manage Habits</h1>
    <p class="text-gray-500">Archive, restore, or delete your habits</p>
  </div>

  <ManageHabits 
    {habits} 
    {archivedHabits}
    onArchive={handleArchive}
    onDelete={handleDelete}
    onRestore={handleRestore}
    {loading}
  />
</div>
