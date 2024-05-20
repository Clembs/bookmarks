<script lang="ts">
	import { icons } from '$lib/helpers/category.svelte';
	import TextInput from './TextInput.svelte';

	let query = $state('');
	let filteredIcons = $derived(
		icons.filter(
			(icon) =>
				icon.name.toLowerCase().includes(query.toLowerCase()) ||
				icon.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase()))
		)
	);

	let hoveredIcon = $state<(typeof icons)[number]>(icons[0]);
	let {
		selectedIcon = $bindable(icons[0])
	}: {
		selectedIcon?: (typeof icons)[number];
	} = $props();
</script>

<div class="category-icon-picker">
	<div class="top-part">
		<TextInput bind:value={query} placeholder="Search icons" />

		<ul class="icons">
			{#each filteredIcons as icon}
				<li class="icon" id={icon.id} aria-current={icon.id === selectedIcon?.id}>
					<button
						onmouseover={() => (hoveredIcon = icon)}
						onfocus={() => (hoveredIcon = icon)}
						onclick={() => (selectedIcon = icon)}
						title={icon.name}
					>
						<svelte:component this={icon.icon} size={32} />
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<section class="hovered-icon">
		<div class="icon">
			<svelte:component this={hoveredIcon.icon} size={32} />
		</div>
		<div class="icon-text">
			<div class="icon-text-name">
				{hoveredIcon.name}
			</div>
			<div class="icon-text-keywords">
				{hoveredIcon.keywords.join(', ')}
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	.category-icon-picker {
		display: flex;
		flex-direction: column;
		max-width: 500px;
		border-radius: var(--round-xlg);
		box-shadow: var(--elevation-2);
	}

	.top-part {
		padding: var(--space-4);
		border-radius: var(--round-xlg) var(--round-xlg) 0 0;
		background-color: var(--color-surface-container);
	}

	.icons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		max-height: 280px;
		overflow-y: auto;
		padding: 2px;
		margin: -2px;
		margin-top: var(--space-4);

		.icon {
			display: grid;
			place-items: center;

			button {
				display: grid;
				place-items: center;

				cursor: pointer;
				border-radius: var(--round-sm);
				padding: var(--space-2);
			}

			&[aria-current='true'],
			&:has(button:focus) {
				button {
					outline: 1px solid var(--color-secondary);
					background-color: var(--color-surface-container-highest);
				}
			}

			&:hover button {
				background-color: var(--color-surface-container-highest);
			}
		}
	}

	.hovered-icon {
		display: flex;
		gap: var(--space-4);
		align-items: center;
		padding: var(--space-4) var(--space-6);
		border-radius: 0 0 var(--round-xlg) var(--round-xlg);
		background-color: var(--color-surface-container-high);
		border-top: 1px solid var(--color-outline);

		.icon {
			display: grid;
			place-items: center;
			color: var(--color-on-surface);
			// border-radius: var(--round-sm);
			// padding: var(--space-2);
			// background-color: var(--color-surface-container-high);
		}

		.icon-text {
			display: flex;
			flex-direction: column;
			gap: var(--space-1);
			color: var(--color-on-surface);

			.icon-text-name {
				font-weight: 600;
			}

			.icon-text-keywords {
				font-size: 0.75rem;
				color: var(--color-on-surface-variant);
			}
		}
	}
</style>
