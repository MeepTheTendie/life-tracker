<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { anyApi } from "convex/server";
  import { Dashboard } from "$components";
  import { Calendar, Sparkles } from "lucide-svelte";

  const api = anyApi;

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric",
    year: "numeric"
  });
</script>

<svelte:head>
  <title>Life Tracker - Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <!-- Date Header -->
  <div class="text-center">
    <p class="text-rose-500 font-bold text-sm uppercase tracking-wider mb-1">{dayName}</p>
    <p class="text-gray-800 font-bold text-2xl">{formattedDate}</p>
  </div>

  <!-- Dashboard -->
  <Dashboard {dateStr} />
</div>
