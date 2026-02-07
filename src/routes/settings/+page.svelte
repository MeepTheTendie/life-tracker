<script lang="ts">
	import { Moon, Bell, Shield, LogOut } from 'lucide-svelte';
	
	let settings = [
		{ id: 'notifications', label: 'Daily Reminders', icon: Bell, enabled: true },
		{ id: 'darkMode', label: 'Dark Mode', icon: Moon, enabled: false },
		{ id: 'privacy', label: 'Privacy Settings', icon: Shield, enabled: true }
	];
	
	function toggleSetting(id: string) {
		const setting = settings.find(s => s.id === id);
		if (setting) {
			setting.enabled = !setting.enabled;
			settings = [...settings];
		}
	}
</script>

<div class="section">
	<h2 class="section-title">Settings</h2>
	
	<div class="settings-list">
		{#each settings as setting}
			<div class="setting-item">
				<div class="setting-left">
					<div class="setting-icon">
						<setting.icon size={20} />
					</div>
					<span class="setting-label">{setting.label}</span>
				</div>
				<button 
					class="toggle-btn"
					class:enabled={setting.enabled}
					onclick={() => toggleSetting(setting.id)}
				>
					<div class="toggle-switch"></div>
				</button>
			</div>
		{/each}
	</div>
	
	<div class="danger-section">
		<button class="logout-btn">
			<LogOut size={18} />
			<span>Sign Out</span>
		</button>
	</div>
	
	<div class="quote-section">
		<p class="version">Life Tracker v2.0</p>
		<p class="quote">"The steadfast love of the Lord never ceases." - Lamentations 3:22</p>
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

	.settings-list {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		margin-bottom: 24px;
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid var(--stone);
	}

	.setting-item:last-child {
		border-bottom: none;
	}

	.setting-left {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.setting-icon {
		color: var(--moss);
	}

	.setting-label {
		font-size: 15px;
		color: var(--ink);
	}

	.toggle-btn {
		width: 50px;
		height: 28px;
		background: var(--stone);
		border: none;
		border-radius: 14px;
		position: relative;
		cursor: pointer;
		transition: background 0.3s;
		padding: 0;
	}

	.toggle-btn.enabled {
		background: var(--moss);
	}

	.toggle-switch {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 22px;
		height: 22px;
		background: white;
		border-radius: 50%;
		transition: transform 0.3s;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.toggle-btn.enabled .toggle-switch {
		transform: translateX(22px);
	}

	.danger-section {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		padding: 8px;
		margin-bottom: 24px;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 16px 24px;
		background: transparent;
		border: none;
		color: #c41e3a;
		font-size: 15px;
		cursor: pointer;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.logout-btn:hover {
		background: rgba(196, 30, 58, 0.05);
	}

	.quote-section {
		text-align: center;
		padding: 40px 20px;
	}

	.version {
		font-size: 12px;
		color: var(--ink-light);
		letter-spacing: 1px;
		margin-bottom: 8px;
	}

	.quote {
		font-family: 'Noto Serif JP', serif;
		font-size: 14px;
		font-style: italic;
		color: var(--moss);
	}

	@media (max-width: 768px) {
		.section {
			padding: 20px;
		}
	}
</style>