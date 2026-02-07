<script lang="ts">
	import { Check } from 'lucide-svelte';
	
	let progress = 50;
	let streak = 12;
	
	let habits = [
		{ id: 'prayer', name: 'Morning Prayer', icon: '🙏', color: '#E8B4B8', category: 'Faith', completed: true },
		{ id: 'bible', name: 'Bible Reading', icon: '📖', color: '#A8D5BA', category: 'Faith', completed: true },
		{ id: 'bath', name: 'Daily Bath', icon: '🛁', color: '#F4E3AC', category: 'Health', completed: false }
	];
	
	let completedCount = $derived(habits.filter(h => h.completed).length);
	let totalHabits = habits.length;
	let progressPercent = $derived((completedCount / totalHabits) * 100);
	
	let currentVerse = "I can do all things through Christ who strengthens me. - Philippians 4:13";
	
	function toggleHabit(id: string) {
		const habit = habits.find(h => h.id === id);
		if (habit) {
			habit.completed = !habit.completed;
			habits = [...habits];
		}
	}
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

<!-- Add Button -->
<div class="add-section">
	<button class="add-btn">
		<span>+</span>
		<span>Add New Habit</span>
	</button>
</div>

<!-- Quote Section -->
<div class="quote-section">
	<p class="quote-text">{currentVerse}</p>
</div>

<style>
	.zen-progress {
		display: flex;
		justify-content: center;
		margin-bottom: 40px;
		position: relative;
	}

	.zen-circle {
		width: 200px;
		height: 200px;
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
		font-size: 42px;
		font-weight: 400;
		color: var(--moss);
		line-height: 1;
	}

	.zen-total {
		font-size: 18px;
		color: var(--ink-light);
	}

	.zen-label {
		font-size: 12px;
		color: var(--ink-light);
		letter-spacing: 2px;
		margin-top: 4px;
	}

	.pebbles {
		position: absolute;
		bottom: -10px;
		display: flex;
		gap: 12px;
	}

	.pebble {
		width: 16px;
		height: 12px;
		background: var(--stone);
		border-radius: 50%;
	}

	.pebble:nth-child(2) {
		width: 12px;
		height: 10px;
		background: var(--moss-light);
	}

	.pebble:nth-child(3) {
		width: 10px;
		height: 8px;
		background: var(--water);
	}

	.streak-card {
		background: linear-gradient(135deg, var(--moss) 0%, var(--bamboo) 100%);
		border-radius: 8px;
		padding: 24px;
		color: white;
		text-align: center;
		margin-bottom: 40px;
		position: relative;
		overflow: hidden;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.streak-label {
		font-size: 12px;
		letter-spacing: 2px;
		opacity: 0.9;
		margin-bottom: 8px;
	}

	.streak-number {
		font-family: 'Noto Serif JP', serif;
		font-size: 42px;
		font-weight: 400;
		margin-bottom: 4px;
	}

	.streak-text {
		font-size: 14px;
		opacity: 0.9;
	}

	.section {
		margin-bottom: 32px;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	.section-line {
		flex: 1;
		height: 1px;
		background: var(--stone);
	}

	.section-title {
		font-size: 11px;
		color: var(--moss);
		letter-spacing: 4px;
		text-transform: uppercase;
		font-weight: 400;
	}

	.habits-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 600px;
		margin: 0 auto;
	}

	.habit-card {
		background: white;
		border-radius: 8px;
		padding: 18px 20px;
		display: flex;
		align-items: center;
		gap: 16px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		border-left: 4px solid transparent;
	}

	.habit-card:hover {
		transform: translateX(4px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.08);
	}

	.habit-card.completed {
		background: linear-gradient(90deg, var(--moss-light) 0%, white 100%);
		border-left-color: var(--moss);
	}

	.habit-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		flex-shrink: 0;
	}

	.habit-content {
		flex: 1;
	}

	.habit-name {
		font-weight: 500;
		font-size: 16px;
		margin-bottom: 4px;
		color: var(--ink);
	}

	.habit-card.completed .habit-name {
		color: var(--bamboo);
	}

	.habit-category {
		font-size: 11px;
		color: var(--ink-light);
		letter-spacing: 1px;
	}

	.habit-enso {
		width: 28px;
		height: 28px;
		border: 2px solid var(--stone);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		transition: all 0.2s;
	}

	.habit-card.completed .habit-enso {
		background: var(--moss);
		border-color: var(--moss);
	}

	.add-section {
		margin-bottom: 32px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 16px;
		border: 1px dashed var(--stone);
		background: transparent;
		color: var(--ink-light);
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
		gap: 8px;
		border-radius: 8px;
	}

	.add-btn:hover {
		border-color: var(--moss);
		color: var(--moss);
	}

	.quote-section {
		background: white;
		border-radius: 8px;
		padding: 28px;
		text-align: center;
		position: relative;
		margin-bottom: 40px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.quote-section::before,
	.quote-section::after {
		content: '"';
		position: absolute;
		font-family: 'Noto Serif JP', serif;
		font-size: 48px;
		color: var(--moss-light);
		opacity: 0.5;
	}

	.quote-section::before {
		top: 10px;
		left: 16px;
	}

	.quote-section::after {
		content: '"';
		bottom: 10px;
		right: 16px;
	}

	.quote-text {
		font-family: 'Noto Serif JP', serif;
		font-size: 16px;
		color: var(--ink);
		line-height: 1.8;
		padding: 0 20px;
	}

	@media (max-width: 768px) {
		.habit-card {
			padding: 16px;
		}

		.habit-icon {
			width: 40px;
			height: 40px;
			font-size: 18px;
		}

		.habit-name {
			font-size: 15px;
		}
	}
</style>