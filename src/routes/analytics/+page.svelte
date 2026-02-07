<script lang="ts">
	import { TrendingUp, Calendar } from 'lucide-svelte';
	
	let streakData = {
		current: 12,
		best: 24,
		week: '18/21',
		rate: '84%'
	};
	
	let weeklyData = [
		{ day: 'Mon', completed: 3, total: 3 },
		{ day: 'Tue', completed: 3, total: 3 },
		{ day: 'Wed', completed: 2, total: 3 },
		{ day: 'Thu', completed: 3, total: 3 },
		{ day: 'Fri', completed: 2, total: 3 },
		{ day: 'Sat', completed: 3, total: 3 },
		{ day: 'Sun', completed: 2, total: 3 }
	];
	
	let monthlyData = [
		{ month: 'Jan', completed: 82, total: 93 },
		{ month: 'Feb', completed: 45, total: 54 }
	];
</script>

<div class="section">
	<h2 class="section-title">Analytics</h2>
	
	<!-- Streak Cards -->
	<div class="streak-grid">
		<div class="streak-card">
			<div class="streak-icon">
				<TrendingUp size={24} />
			</div>
			<div class="streak-value">{streakData.current}</div>
			<div class="streak-label">Current Streak</div>
		</div>
		<div class="streak-card">
			<div class="streak-icon">
				<Calendar size={24} />
			</div>
			<div class="streak-value">{streakData.best}</div>
			<div class="streak-label">Best Streak</div>
		</div>
		<div class="streak-card">
			<div class="streak-value">{streakData.week}</div>
			<div class="streak-label">This Week</div>
		</div>
		<div class="streak-card">
			<div class="streak-value">{streakData.rate}</div>
			<div class="streak-label">Success Rate</div>
		</div>
	</div>
	
	<!-- Weekly Progress -->
	<div class="chart-section">
		<h3 class="chart-title">This Week</h3>
		<div class="week-chart">
			{#each weeklyData as day}
				<div class="day-bar">
					<div class="bar-container">
						<div 
							class="bar-fill"
							style="height: {(day.completed / day.total) * 100}%"
						></div>
					</div>
					<div class="day-label">{day.day}</div>
				</div>
			{/each}
		</div>
	</div>
	
	<!-- Monthly Summary -->
	<div class="monthly-section">
		<h3 class="chart-title">Monthly Summary</h3>
		{#each monthlyData as month}
			<div class="month-row">
				<div class="month-name">{month.month}</div>
				<div class="month-progress">
					<div class="progress-track">
						<div 
							class="progress-bar"
							style="width: {(month.completed / month.total) * 100}%"
						></div>
					</div>
					<span class="progress-text">{month.completed}/{month.total}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.section {
		padding: 20px 40px;
		max-width: 800px;
		margin: 0 auto;
	}

	.section-title {
		font-family: 'Noto Serif JP', serif;
		font-size: 24px;
		color: var(--ink);
		margin-bottom: 24px;
		padding-bottom: 12px;
		border-bottom: 2px solid var(--stone);
	}

	.streak-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 40px;
	}

	.streak-card {
		background: white;
		border-radius: 8px;
		padding: 24px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	}

	.streak-icon {
		color: var(--moss);
		margin-bottom: 12px;
	}

	.streak-value {
		font-family: 'Noto Serif JP', serif;
		font-size: 32px;
		color: var(--moss);
		margin-bottom: 4px;
	}

	.streak-label {
		font-size: 12px;
		color: var(--ink-light);
		letter-spacing: 1px;
	}

	.chart-section {
		background: white;
		border-radius: 8px;
		padding: 24px;
		margin-bottom: 24px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	}

	.chart-title {
		font-size: 14px;
		color: var(--ink-light);
		letter-spacing: 2px;
		text-transform: uppercase;
		margin-bottom: 20px;
	}

	.week-chart {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 150px;
		padding: 20px 0;
	}

	.day-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		flex: 1;
	}

	.bar-container {
		width: 40px;
		height: 100px;
		background: var(--stone);
		border-radius: 20px;
		position: relative;
		overflow: hidden;
	}

	.bar-fill {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--moss);
		border-radius: 20px;
		transition: height 0.3s ease;
	}

	.day-label {
		font-size: 12px;
		color: var(--ink-light);
		letter-spacing: 1px;
	}

	.monthly-section {
		background: white;
		border-radius: 8px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	}

	.month-row {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 16px 0;
		border-bottom: 1px solid var(--stone);
	}

	.month-row:last-child {
		border-bottom: none;
	}

	.month-name {
		font-weight: 600;
		width: 60px;
		color: var(--ink);
	}

	.month-progress {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.progress-track {
		flex: 1;
		height: 8px;
		background: var(--stone);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: var(--moss);
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-family: 'Noto Serif JP', serif;
		font-size: 14px;
		color: var(--ink);
		min-width: 60px;
		text-align: right;
	}

	@media (max-width: 768px) {
		.streak-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.section {
			padding: 20px;
		}
	}
</style>