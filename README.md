# Life Tracker v2

A beautiful habit tracking application built with Svelte 5, Convex, and Tailwind CSS.

## Features

- Track daily habits with customizable categories
- Multiple tracking types: boolean, numeric, duration, rating
- Beautiful Wes Anderson-inspired aesthetic
- Analytics dashboard with streak tracking and completion rates
- Archive and manage habits
- Real-time data synchronization with Convex

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Convex URL and authentication credentials.

3. Start the development server:
```bash
bun run dev
```

This will start both the SvelteKit dev server and Convex dev server.

## Project Structure

```
src/
  lib/
    components/     # Svelte components
    convex.ts       # Convex client setup
  routes/           # SvelteKit routes
  types/            # TypeScript types
convex/             # Convex functions
  schema.ts         # Database schema
  habits.ts         # Habit queries/mutations
  habitEntries.ts   # Entry queries/mutations
  analytics.ts      # Analytics queries
  seed.ts           # Seed data
```

## Default Habits

The app includes default habits:
- Prayer (Mindfulness)
- Calls (Relationships)
- Daily Bath (Routine)
- Bible Reading (Mindfulness)

## Tech Stack

- Svelte 5 with runes ($state, $effect, $derived)
- Convex for backend and real-time sync
- Tailwind CSS for styling
- Lucide icons
- Chart.js for analytics
