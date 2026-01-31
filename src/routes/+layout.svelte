<script lang="ts">
  import { createConvexClient } from "$lib/convex";
  import { anyApi } from "convex/server";
  import { Home, TrendingUp, Settings, User } from "lucide-svelte";
  import "../app.css";

  const api = anyApi;

  const { data } = $props();
  const { isAuthenticated, user } = data;

  // Initialize Convex client
  const convex = createConvexClient();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/analytics", icon: TrendingUp, label: "Analytics" },
    { href: "/manage", icon: Settings, label: "Manage" },
  ];
</script>

<div class="min-h-screen bg-gray-50 font-sans pb-20">
  <!-- Header -->
  <header class="bg-slate-800 text-white px-4 py-4 sticky top-0 z-50">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <h1 class="text-xl font-bold tracking-tight">Life Tracker</h1>
      {#if isAuthenticated}
        <div class="flex items-center gap-3">
          {#if user?.image}
            <img src={user.image} alt={user.name || "User"} class="w-8 h-8 rounded-full" />
          {:else}
            <div class="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center">
              <User class="w-5 h-5 text-white" />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </header>

  <!-- Main Content -->
  <main class="px-4 py-6 md:px-8 flex justify-center">
    <div class="max-w-2xl w-full">
      <slot />
    </div>
  </main>

  <!-- Bottom Navigation -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
    <div class="max-w-2xl mx-auto flex justify-around">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-rose-500"
        >
          <item.icon class="w-6 h-6" />
          <span class="text-xs font-medium">{item.label}</span>
        </a>
      {/each}
    </div>
  </nav>
</div>
