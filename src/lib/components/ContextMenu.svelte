<script lang="ts">
	import type { ComponentType } from 'svelte';
	import KeyboardShortcut from '$lib/components/KeyboardShortcut.svelte';
	import IndeterminateProgressSpinner from '$lib/components/IndeterminateProgressSpinner.svelte';

	type Action = () => void | Promise<void>;

	let { x, y, items, visible, el, onclose } = $props<{
		x: number;
		y: number;
		items: { label: string; action: Action | string; icon?: ComponentType; shortcut?: string }[];
		visible: boolean;
		el?: HTMLUListElement;
		onclose?: () => void;
	}>();

	let selectedMenuItem = $state<number>();
	let loadingMenuItem = $state<string>();

	function closeMenu() {
		visible = false;
		selectedMenuItem = undefined;
		onclose?.();
	}

	async function handleAction(item: (typeof items)[number]) {
		if (typeof item.action === 'string') return;
		loadingMenuItem = item.label;

		await item.action();

		loadingMenuItem = undefined;
		closeMenu();
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'Escape') closeMenu();
		if (ev.key === 'ArrowUp' && selectedMenuItem !== undefined && selectedMenuItem > 0) {
			ev.preventDefault();
			selectedMenuItem = (selectedMenuItem - 1 + items.length) % items.length;

			const clickable: HTMLAnchorElement | HTMLButtonElement = document.getElementById(`ctx-item-${selectedMenuItem}`)?.querySelector('button, a')!;
			clickable?.focus();
		}
		if (ev.key === 'ArrowDown' && (selectedMenuItem || 0) < items.length - 1) {
			ev.preventDefault();
			selectedMenuItem = selectedMenuItem === undefined ? 0 : (selectedMenuItem + 1) % items.length;
			const clickable: HTMLAnchorElement | HTMLButtonElement = document.getElementById(`ctx-item-${selectedMenuItem}`)?.querySelector('button, a')!;
			clickable?.focus();
		}
	}}
	onclick={(ev) => {
		if (el && !el.contains(ev.target as Node)) closeMenu();
	}}
/>

{#snippet contextMenuItemLabel(item: typeof items[number])}
	<div class="label">
		{#if loadingMenuItem === item.label}
			<IndeterminateProgressSpinner />
		{:else if item.icon}
			<svelte:component this={item.icon} variation="filled" size={18} />
		{/if}
		{item.label}
	</div>
	{#if item.shortcut}
		<KeyboardShortcut shortcut={item.shortcut} />
	{/if}
{/snippet}

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
	{#each items as item, i}
		<li role="menuitem" id="ctx-item-{i}">
			{#if typeof item.action === 'string'}
				<a
					href={item.action}
					target="_blank"
					rel="noopener noreferrer"
					data-selected={!!selectedMenuItem && i === selectedMenuItem}
				>
					{@render contextMenuItemLabel(item)}
				</a>
			{:else}
				<button
					onclick={() => typeof item.action === 'function' && handleAction(item)}
					data-selected={i === selectedMenuItem}
				>
					{@render contextMenuItemLabel(item)}
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	.context-menu {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		min-width: 118px;
		max-width: 280px;
		background-color: var(--color-surface-container);
		color: var(--color-on-surface);
		border-radius: var(--round-xsm);
		box-shadow: var(--elevation-2);
		padding: var(--space-1) 0;
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
			border-radius: var(--round-xsm);
			cursor: pointer;
			text-align: left;
			outline: none;

			&:hover,
			&:focus-within {
				background-color: var(--color-surface-container-highest);
			}
		}
	}

	.label {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
</style>
