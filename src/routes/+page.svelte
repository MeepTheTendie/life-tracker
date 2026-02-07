<script lang="ts">
	import { Check } from 'lucide-svelte';
	import { supabase, getLocalUserId } from '$lib/supabase';
	import { onMount } from 'svelte';
	
	let streak = $state(0);
	
	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];
	const dayName = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	
	let habits = $state([
		{ id: 'prayer', name: 'Morning Prayer', icon: '🙏', color: '#8b9d83', category: 'Faith', completed: false },
		{ id: 'bible', name: 'Bible Reading', icon: '📖', color: '#6b8e6b', category: 'Faith', completed: false },
		{ id: 'bath', name: 'Daily Bath', icon: '🛁', color: '#a8c8c8', category: 'Health', completed: false }
	]);
	
	let completedCount = $derived(habits.filter(h => h.completed).length);
	let totalHabits = habits.length;
	let progressPercent = $derived((completedCount / totalHabits) * 100);
	
	let currentVerse = $state("");
	let verseRef = $state("");
	
	const verses = [
		{ text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
		{ text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
		{ text: "But those who hope in the Lord will renew their strength.", ref: "Isaiah 40:31" },
		{ text: "Whatever you do, work at it with all your heart.", ref: "Colossians 3:23" },
		{ text: "The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied.", ref: "Proverbs 13:4" }
	];
	
	function getDailyVerse() {
		const dayOfYear = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
		const verseIndex = dayOfYear % verses.length;
		currentVerse = verses[verseIndex].text;
		verseRef = verses[verseIndex].ref;
	}
	
	async function loadData() {
		const userId = getLocalUserId();
		getDailyVerse();
		
		// Load today's habits
		const { data: todayEntry } = await supabase
			.from('habit_entries')
			.select('*')
			.eq('user_id', userId)
			.eq('date', todayStr)
			.single();
		
		if (todayEntry && todayEntry.habit_data) {
			const savedHabits = JSON.parse(todayEntry.habit_data);
			habits = savedHabits;
		}
		
		// Load streak
		const { data: allEntries } = await supabase
			.from('habit_entries')
			.select('date')
			.eq('user_id', userId)
			.eq('completed', true);
		
		if (allEntries) {
			// Count unique days where all habits were completed
			const uniqueDays = new Set(allEntries.map(e => e.date));
			streak = uniqueDays.size;
		}
	}
	
	async function toggleHabit(id: string) {
		const userId = getLocalUserId();
		const habit = habits.find(h => h.id === id);
		if (!habit) return;
		
		habit.completed = !habit.completed;
		habits = [...habits];
		
		const allCompleted = habits.filter(h => h.completed).length === totalHabits;
		
		// Save to Supabase
		await supabase.from('habit_entries').upsert({
			user_id: userId,
			date: todayStr,
			habit_data: JSON.stringify(habits),
			completed: allCompleted
		}, { onConflict: 'user_id,date' });
		
		// Recalculate streak
		const { data: allEntries } = await supabase
			.from('habit_entries')
			.select('date')
			.eq('user_id', userId)
			.eq('completed', true);
		
		if (allEntries) {
			const uniqueDays = new Set(allEntries.map(e => e.date));
			streak = uniqueDays.size;
		}
	}
	
	onMount(() => {
		loadData();
	});
</script>

<!-- Zen Progress Circle -->
<div class="zen-progress">
	<div class="zen-circle">
		<svg class="progress-ring" width="200" height="200" viewBox="0 0 200 200">
			<circle class="progress-ring-bg" cx="100" cy="100" r="85" />
			<circle 
				class="progress-ring-fill" 
				cx="100" 
				cy="100" 
				r="85"
				style="stroke-dashoffset: {535 - (535 * progressPercent / 100)}"
			/>
		</svg>
		<div class="zen-content">
			<div class="zen-number">{completedCount}<span class="zen-total">/{totalHabits}</span></div>
			<div class="zen-label">completed</div>
		</div>
	</div>
	<div class="pebbles">
		<div class="pebble"></div>
		<div class="pebble"></div>
		<div class="pebble"></div>
	</div>
</div>

<!-- Streak Card -->
<div class="streak-card">
	<div class="streak-label">Current Streak</div>
	<div class="streak-number">{streak} Days</div>
	<div class="streak-text">Small steps lead to great journeys</div>
</div>

<!-- Habits Section -->
<div class="section">
	<div class="section-header">
		<span class="section-title">Habits</span>
		<div class="section-line"></div>
	</div>

	<div class="habits-list">
		{#each habits as habit (habit.id)}
			<div class="habit-card" class:completed={habit.completed} onclick={() => toggleHabit(habit.id)}>
				<div class="habit-icon" style="background-color: {habit.color}">
					{habit.icon}
				</div>
				<div class="habit-content">
					<div class="habit-name">{habit.name}</div>
					<div class="habit-category">{habit.category}</div>
				</div>
				<div class="habit-enso">
					{#if habit.completed}
						<Check size={14} strokeWidth={2} />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Daily Verse -->
<div class="verse-card">
	<div class="verse-text">"{currentVerse}"</div>
	<div class="verse-ref">- {verseRef}</div>
</div>

<!-- Quick Access -->
<div class="quick-access">
	<a href="/analytics" class="quick-btn">
		📊 Journal
	</a>
	<a href="/settings" class="quick-btn">
		⚙️ Settings
	</a>
</div>

<style>
	.zen-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 0 30px;
		position: relative;
	}
	
	.zen-circle {
		position: relative;
	}
	
	.progress-ring {
		transform: rotate(-90deg);
	}
	
	.progress-ring-bg {
		fill: none;
		stroke: var(--stone);
		stroke-width: 8;
	}
	
	.progress-ring-fill {
		fill: none;
		stroke: var(--moss);
		stroke-width: 8;
		stroke-linecap: round;
		stroke-dasharray: 535;
		stroke-dashoffset: 535;
		transition: stroke-dashoffset 0.5s ease;
	}
	
	.zen-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	
	.zen-number {
		font-family: 'Noto Serif JP', serif;
		font-size: 64px;
		font-weight: 300;
		color: var(--moss);
		line-height: 1;
	}
	
	.zen-total {
		font-size: 28px;
		opacity: 0.5;
	}
	
	.zen-label {
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 11px;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--ink-light);
		margin-top: 8px;
	}
	
	.pebbles {
		display: flex;
		gap: 12px;
		margin-top: 30px;
	}
	
	.pebble {
		width: 12px;
		height: 12px;
		background: var(--moss-light);
		border-radius: 50%;
		opacity: 0.6;
	}
	
	.streak-card {
		background: white;
		border: 1px solid var(--stone);
		border-radius: 16px;
		padding: 30px;
		text-align: center;
		margin: 0 20px 30px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}
	
	.streak-label {
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--ink-light);
	}
	
	.streak-number {
		font-family: 'Noto Serif JP', serif;
		font-size: 48px;
		font-weight: 300;
		color: var(--moss);
		margin: 10px 0;
	}
	
	.streak-text {
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 13px;
		color: var(--ink-light);
		font-style: italic;
	}
	
	.section {
		padding: 0 20px;
		margin-bottom: 30px;
	}
	
	.section-header {
		display: flex;
		align-items: center;
		gap: 15px;
		margin-bottom: 20px;
	}
	
	.section-title {
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--ink-light);
		white-space: nowrap;
	}
	
	.section-line {
		height: 1px;
		background: linear-gradient(90deg, var(--stone) 0%, transparent 100%);
		flex: 1;
	}
	
	.habits-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.habit-card {
		display: flex;
		align-items: center;
		gap: 16px;
		background: white;
		border: 1px solid var(--stone);
		border-radius: 16px;
		padding: 20px;
		transition: all 0.3s ease;
		cursor: pointer;
	}
	
	.habit-card:hover {
		border-color: var(--moss);
		box-shadow: 0 4px 20px rgba(139, 157, 131, 0.1);
	}
	
	.habit-card.completed {
		background: linear-gradient(135deg, rgba(139, 157, 131, 0.08) 0%, rgba(197, 212, 189, 0.08) 100%);
		border-color: var(--moss-light);
	}
	
	.habit-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		flex-shrink: 0;
	}
	
	.habit-content {
		flex: 1;
	}
	
	.habit-name {
		font-family: 'Noto Serif JP', serif;
		font-size: 18px;
		color: var(--ink);
		margin-bottom: 4px;
	}
	
	.habit-category {
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 11px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--ink-light);
	}
	
	.habit-enso {
		width: 28px;
		height: 28px;
		border: 2px solid var(--stone);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--moss);
		transition: all 0.3s ease;
	}
	
	.habit-card.completed .habit-enso {
		background: var(--moss);
		border-color: var(--moss);
		color: white;
	}
	
	.verse-card {
		background: linear-gradient(135deg, rgba(139, 157, 131, 0.06) 0%, rgba(168, 200, 200, 0.06) 100%);
		border: 1px solid var(--moss-light);
		border-radius: 16px;
		padding: 25px 30px;
		margin: 0 20px 30px;
		text-align: center;
	}
	
	.verse-text {
		font-family: 'Noto Serif JP', serif;
		font-size: 16px;
		font-style: italic;
		color: var(--ink);
		line-height: 1.6;
		margin-bottom: 12px;
	}
	
	.verse-ref {
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 12px;
		letter-spacing: 1px;
		color: var(--moss);
	}
	
	.quick-access {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
		padding: 0 20px 40px;
	}
	
	.quick-btn {
		display: block;
		text-align: center;
		padding: 18px;
		background: white;
		border: 1px solid var(--stone);
		border-radius: 16px;
		font-family: 'Noto Sans JP', sans-serif;
		font-size: 13px;
		letter-spacing: 1px;
		text-decoration: none;
		color: var(--ink);
		transition: all 0.3s ease;
	}
	
	.quick-btn:hover {
		border-color: var(--moss);
		color: var(--moss);
	}
</style>
