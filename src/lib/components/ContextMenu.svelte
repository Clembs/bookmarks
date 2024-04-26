<script lang="ts">
	import KeyboardShortcut from '$lib/components/KeyboardShortcut.svelte';
	import IndeterminateProgressSpinner from '$lib/components/IndeterminateProgressSpinner.svelte';
	import Scrim from './Scrim.svelte';
	import type { ContextMenuAction } from '$lib/types';

	let { x, y, actions, visible = $bindable(), el, onclose }: {
		x: number;
		y: number;
		actions: ContextMenuAction[];
		visible: boolean;
		el?: HTMLUListElement;
		onclose?: () => void;
	} = $props();

	let selectedMenuItem = $state<number>();
	let loadingMenuItem = $state<string>();

	function closeMenu() {
		visible = false;
		selectedMenuItem = undefined;
		onclose?.();
	}

	async function handleAction(action: ContextMenuAction) {
		if (typeof action.action === 'string') return;
		loadingMenuItem = action.label;

		await action.action();

		loadingMenuItem = undefined;
		closeMenu();
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'Escape') closeMenu();
		if (ev.key === 'ArrowUp' && selectedMenuItem !== undefined && selectedMenuItem > 0) {
			ev.preventDefault();
			selectedMenuItem = (selectedMenuItem - 1 + actions.length) % actions.length;

			const clickable: HTMLAnchorElement | HTMLButtonElement = document.getElementById(`ctx-item-${selectedMenuItem}`)?.querySelector('button, a')!;
			clickable?.focus();
		}
		if (ev.key === 'ArrowDown' && (selectedMenuItem || 0) < actions.length - 1) {
			ev.preventDefault();
			selectedMenuItem = selectedMenuItem === undefined ? 0 : (selectedMenuItem + 1) % actions.length;
			const clickable: HTMLAnchorElement | HTMLButtonElement = document.getElementById(`ctx-item-${selectedMenuItem}`)?.querySelector('button, a')!;
			clickable?.focus();
		}
	}}
	onclick={(ev) => {
		if (el && !el.contains(ev.target as Node)) closeMenu();
	}}
/>

{#snippet contextMenuItemLabel(item: typeof actions[number])}
	<div class="label">
		{#if loadingMenuItem === item.label}
			<IndeterminateProgressSpinner />
		{:else if item.icon}
			<svelte:component this={item.icon} weight="fill" size={18} />
		{/if}
		{item.label}
	</div>
	{#if item.shortcut}
		<KeyboardShortcut shortcut={item.shortcut} />
	{/if}
{/snippet}

<Scrim
	id="context-menu-scrim"
	onclose={() => {
		console.log('onclose');
		closeMenu();
	}}
/>

<ul
	role="menu"
	class="context-menu"
	style="--x: {x}px;--y: {y}px;"
	onmouseenter={() => {
		selectedMenuItem = undefined;
		(document.activeElement as HTMLAnchorElement | HTMLButtonElement)?.blur();
	}}
	bind:this={el}
>
	{#each actions as actions, i}
		<li role="menuitem" id="ctx-item-{i}">
			{#if typeof actions.action === 'string'}
				<a
					href={actions.action}
					target="_blank"
					rel="noopener noreferrer"
					data-selected={!!selectedMenuItem && i === selectedMenuItem}
				>
					{@render contextMenuItemLabel(actions)}
				</a>
			{:else}
				<button
					onclick={() => typeof actions.action === 'function' && handleAction(actions)}
					data-selected={i === selectedMenuItem}
				>
					{@render contextMenuItemLabel(actions)}
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	@import '../../styles/vars.scss';

	.context-menu {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		min-width: 118px;
		max-width: 280px;
		background-color: var(--color-surface-container);
		color: var(--color-on-surface);
		border-radius: var(--round-md);
		box-shadow: var(--elevation-2);
		padding: var(--space-1);
		display: flex;
		flex-direction: column;
		transform: translate(var(--x), var(--y));

		button,
		a {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-6);
			width: 100%;
			padding: var(--space-2) var(--space-3);
			border-radius: var(--round-sm);
			cursor: pointer;
			text-align: left;
			outline: none;
			transition: scale var(--transition-in-out-standard), background-color var(--transition-in-out-standard);

			&:hover,
			&:focus-within {
				background-color: var(--color-surface-container-highest);
			}

			&:hover:active {
				scale: 0.98;
			}

			@media (max-width: $compact) {
				padding: var(--space-4) var(--space-4);
				border-radius: var(--round-lg);
			}
		}

		@media (max-width: $compact) {
			bottom: 0;
			width: 100%;
			transform: none;
			top: auto;
			max-width: 100%;
			border-radius: var(--round-xlg) var(--round-xlg) 0 0;
			padding: var(--space-4) var(--space-3);
		}
	}

	@media (min-width: $compact) {
		:global(#context-menu-scrim) {
			display: none;
		}
	}

	.label {
		display: flex;
		align-items: center;
		gap: var(--space-3);

		@media (max-width: $compact) {
			gap: var(--space-6);

			:global(svg) {
				width: 24px;
				height: 24px;
			}
		}
	}
</style>
