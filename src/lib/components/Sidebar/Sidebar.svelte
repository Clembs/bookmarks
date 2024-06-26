<script lang="ts">
	import { page } from '$app/stores';
	import { type DialogOptions } from '$lib/components/Dialog.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { contextMenu, dialog, screenSize } from '$lib/helpers/navigation.svelte';
	import { BookmarkSimple, GearSix, Plus } from 'phosphor-svelte';
	import SidebarItem from './SidebarItem.svelte';
	import type { RawCategory } from '$lib/types';
	import { getCategoryContextMenuItems } from '$lib/helpers/context-menu/category';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import Category from './Category.svelte';
	import Button from '../Button.svelte';

	let { isSidebarOpen = $bindable() } = $props();

	const dialogOpts = {
		headline: 'Create folder',
		formActionUrl: '/api/categories/create?',
		actions: [
			{
				label: 'Cancel',
				action: 'close'
			},
			{
				label: 'Create',
				action: 'submit',
				type: 'filled'
			}
		],
		children: dialogContent
	} satisfies DialogOptions;

	function showContextMenu(ev: MouseEvent, category: RawCategory) {
		contextMenu.open(ev, getCategoryContextMenuItems(category));
	}

	$effect(() => {
		screenSize; // i'm not stupid, it's just how svelte expects dependencies to be declared in effects
		isSidebarOpen = screenSize.width >= 1200;
	});
</script>

{#snippet dialogContent()}
	<TextInput tabindex={1} maxlength={32} name="name" label="Name" required autofocus />
{/snippet}

<svelte:window
	onkeydown={(ev) =>
		handleKeyboardShortcut(ev, [
			{
				meta: true,
				shift: true,
				key: 'N',
				action: () => dialog.open(dialogOpts)
			}
		])}
/>

<div id="sidebar-wrapper" data-active={isSidebarOpen}>
	<aside>
		<div id="title">
			<div id="title-logo">
				<BookmarkSimple weight="fill" color="var(--color-on-secondary)" size={24} />
			</div>
			saveit
		</div>

		<Category />

		<section id="categories">
			<header>
				<div class="category-name">Folders</div>

				<Button style="text" inline onclick={() => dialog.open(dialogOpts)} title="Create folder">
					<Plus size={16} />
				</Button>
			</header>

			<ul id="top-items">
				{#each $page.data.categories as RawCategory[] as category (category.id)}
					<Category {category} oncontextmenu={(ev) => showContextMenu(ev, category)} />
				{/each}
			</ul>
		</section>

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
		min-width: 280px;
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
		width: 280px;
		overflow-x: hidden;
		z-index: 9;
		padding: var(--space-2);

		#title {
			font-size: 1.5rem;
			font-family: var(--fonts-headings);
			font-weight: 600;
			padding: var(--space-3) 0;
			padding-left: var(--space-2);
			display: flex;
			color: var(--color-on-surface);
			gap: var(--space-3);
			align-items: center;
			margin-bottom: 0.5rem;

			#title-logo {
				display: grid;
				place-items: center;
				border-radius: var(--round-sm);
				padding: var(--space-1);
				background-color: var(--color-secondary);
				box-shadow: var(--elevation-1);
			}
		}

		section {
			margin: var(--space-2) 0;

			header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-left: var(--space-2);
				margin-top: calc(0 - var(--space-1));

				.category-name {
					font-size: 0.75rem;
					font-weight: 500;
					text-transform: uppercase;
					color: var(--color-on-surface-variant);
				}
			}
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);

			&#bottom-items {
				margin-top: auto;
			}
		}
	}
</style>
