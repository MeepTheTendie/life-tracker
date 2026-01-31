<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { anyApi } from "convex/server";
  import { Analytics } from "$components";
  import { BarChart3 } from "lucide-svelte";

  const api = anyApi;
  const client = createConvexClient();

  let analytics = $state<any[]>([]);
  let loading = $state(true);

  $effect(() => {
    async function fetchAnalytics() {
      try {
        const result = await client.query(api.analytics.getAllAnalytics, { days: 30 });
        analytics = result || [];
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        loading = false;
      }
    }
    loading = true;
    fetchAnalytics();
  });
</script>

<svelte:head>
  <title>Life Tracker - Analytics</title>
</svelte:head>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
      <BarChart3 class="w-7 h-7 text-rose-500" />
      Analytics
    </h1>
    <p class="text-gray-500">Track your progress and build better habits</p>
  </div>

  {#if loading}
    <div class="animate-pulse space-y-4">
      <div class="h-24 bg-gray-200 rounded-2xl"></div>
      <div class="h-48 bg-gray-200 rounded-2xl"></div>
      <div class="h-48 bg-gray-200 rounded-2xl"></div>
    </div>
  {:else}
    <Analytics {analytics} />
  {/if}
</div>
