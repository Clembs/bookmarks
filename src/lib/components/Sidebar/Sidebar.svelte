<script lang="ts">
	import { page } from '$app/stores';
	import Dialog from '$lib/components/Dialog.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { contextMenu, screenSize } from '$lib/helpers/navigation.svelte';
	import { GearSix, Plus, SquaresFour } from 'phosphor-svelte';
	import SidebarItem from './SidebarItem.svelte';
	import type { RawCategory } from '$lib/types';
	import { getCategoryContextMenuItems } from '$lib/helpers/context-menu/category';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import Category from './Category.svelte';

	let { isSidebarOpen = $bindable() } = $props();
	let isCreationModalOpen = $state(false);

	function showContextMenu(ev: MouseEvent, category: RawCategory) {
		contextMenu.open(ev, getCategoryContextMenuItems(category));
	}

	$effect(() => {
		screenSize; // i'm not stupid, it's just how svelte expects dependencies to be declared in effects
		isSidebarOpen = screenSize.width >= 1200;
	});
</script>

<svelte:window
	onkeydown={(ev) =>
		handleKeyboardShortcut(ev, [
			{
				meta: true,
				shift: true,
				key: 'N',
				action: () => (isCreationModalOpen = true)
			}
		])}
/>

<Dialog
	bind:showModal={isCreationModalOpen}
	headline="Create folder"
	formActionUrl="/api/categories/create?"
	actions={[
		{
			label: 'Cancel',
			action: 'close'
		},
		{
			label: 'Create',
			action: 'submit',
			type: 'filled'
		}
	]}
	onclose={() => (isCreationModalOpen = false)}
>
	<TextInput maxlength={32} name="name" label="Name" required autofocus />
</Dialog>

<div id="sidebar-wrapper" data-active={isSidebarOpen}>
	<aside>
		<div id="title">saveit</div>

		<ul id="top-items">
			<SidebarItem href="/app" icon={SquaresFour} active={$page.url.pathname === '/app'}>
				Unorganized
			</SidebarItem>
			{#each $page.data.categories as RawCategory[] as category (category.id)}
				<Category {category} oncontextmenu={(ev) => showContextMenu(ev, category)} />
			{/each}
			<SidebarItem icon={Plus} onclick={() => (isCreationModalOpen = true)}>
				Create folder
			</SidebarItem>
		</ul>

		<ul id="bottom-items">
			<SidebarItem icon={GearSix} href="/settings" active={$page.url.pathname === '/settings'}>
				Settings
			</SidebarItem>
		</ul>
	</aside>
</div>

<style lang="scss">
	@import '../../../styles/vars.scss';

	#sidebar-wrapper {
		min-width: 360px;
		overflow: hidden;
		width: 0;
		background-color: var(--color-surface-container-low);
		color: var(--color-on-surface-variant);
		border-radius: 0 var(--round-lg) var(--round-lg) 0;

		transition: min-width var(--transition-enter-screen-emphasized);
		z-index: 1;

		:global(svg) {
			flex-shrink: 0;
		}

		&[data-active='false'] {
			min-width: 0;
			padding: 0;
			transition: min-width var(--transition-exit-screen-emphasized);
		}

		@media (max-width: $compact) {
			min-width: 0;
			padding: 0;
		}
	}

	aside {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 360px;
		overflow-x: hidden;
		z-index: 9;
		padding: var(--space-3);

		#title {
			font-size: 1.5rem;
			font-family: var(--fonts-headings);
			font-weight: 600;
			padding: var(--space-3) 0;
			padding-left: var(--space-2);
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: var(--space-1);

			&#bottom-items {
				margin-top: auto;
			}
		}
	}
</style>
