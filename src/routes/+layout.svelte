<script lang="ts">
	import { Sun, BookOpen, Bath } from 'lucide-svelte';
	import '../app.css';
	
	let { children } = $props();
	
	const navItems = [
		{ href: "/", icon: Sun, label: "Today" },
		{ href: "/analytics", icon: BookOpen, label: "Journal" },
		{ href: "/settings", icon: Bath, label: "Settings" },
	];
</script>

<div class="app-container">
	<header class="header">
		<div class="header-line"></div>
		<div class="greeting">今日</div>
		<div class="date">Wednesday, February 6</div>
	</header>

	<main class="main">
		{@render children()}
	</main>

	<nav class="bottom-nav">
		{#each navItems as item}
			<a href={item.href} class="nav-item">
				<item.icon class="nav-icon" />
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	:global(:root) {
		--sand: #f7f5f0;
		--stone: #e8e4dc;
		--moss: #8b9d83;
		--moss-light: #c5d4bd;
		--bamboo: #6b8e6b;
		--water: #a8c8c8;
		--ink: #3a3a3a;
		--ink-light: #6a6a6a;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
		background: linear-gradient(180deg, var(--sand) 0%, #f0ece4 100%);
		color: var(--ink);
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
	}

	.app-container {
		max-width: 1200px;
		margin: 0 auto;
		min-height: 100vh;
		padding-bottom: 100px;
	}

	.header {
		padding: 60px 40px 40px;
		text-align: center;
		position: relative;
	}

	.header-line {
		position: absolute;
		top: 30px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 2px;
		background: var(--moss);
	}

	.greeting {
		font-family: 'Noto Serif JP', serif;
		font-size: 18px;
		color: var(--moss);
		letter-spacing: 8px;
		margin-bottom: 12px;
		text-transform: uppercase;
	}

	.date {
		font-size: 28px;
		font-weight: 300;
		color: var(--ink);
		letter-spacing: 2px;
	}

	.main {
		padding: 0 40px;
		max-width: 800px;
		margin: 0 auto;
	}

	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 1200px;
		background: white;
		border-top: 1px solid var(--stone);
		padding: 20px 40px 32px;
		display: flex;
		justify-content: center;
		gap: 60px;
		z-index: 100;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: var(--ink-light);
		text-decoration: none;
		font-size: 12px;
		letter-spacing: 2px;
		transition: all 0.3s ease;
		padding: 12px 24px;
		border-radius: 8px;
	}

	.nav-item:hover,
	.nav-item.active {
		color: var(--moss);
		background: var(--moss-light);
	}

	.nav-icon {
		width: 24px;
		height: 24px;
	}

	.nav-label {
		font-size: 11px;
		text-transform: uppercase;
	}

	@media (max-width: 768px) {
		.app-container {
			max-width: 100%;
		}

		.header {
			padding: 40px 20px 30px;
		}

		.greeting {
			font-size: 16px;
		}

		.date {
			font-size: 22px;
		}

		.main {
			padding: 0 20px;
		}

		.bottom-nav {
			padding: 16px 20px 28px;
			gap: 20px;
		}
	}
</style>