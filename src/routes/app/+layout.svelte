<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { List, TextOutdent } from 'phosphor-svelte';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
	import { contextMenu, dialog } from '$lib/helpers/navigation.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Dialog from '$lib/components/Dialog.svelte';

	let { children, data } = $props();

	let isSidebarOpen = $state(!data.isMobile || false);
</script>

{#if contextMenu.state.state === 'open'}
	<ContextMenu
		x={contextMenu.state.x}
		y={contextMenu.state.y}
		actions={contextMenu.state.actions}
		visible={contextMenu.state.state === 'open'}
		onclose={() => {
			contextMenu.close();
		}}
	/>
{/if}

<Toaster position="bottom-right" toastOptions={{
	className: 'toast'
}} />

{#if dialog.state.showModal}
	<Dialog {...dialog.state} bind:showModal={dialog.state.showModal} />
{/if}

<div id="layout">
	<Sidebar bind:isSidebarOpen />

	<div id="scrollable-wrapper" tabindex="-1">
		<div id="menu-btn">
			<Button
				style="text"
				icon
				onclick={() => {
					isSidebarOpen = !isSidebarOpen;
				}}
			>
			{#if isSidebarOpen}
				<TextOutdent />
			{:else}
				<List />
			{/if}
			</Button>
		</div>
		
		<main>
			{@render children()}
		</main>
	</div>
</div>

<style lang="scss">
	@import '../../styles/vars.scss';

	#layout {
		display: flex;
		height: 100vh;
		background-color: var(--color-surface-container-low);

		#menu-btn {
			display: none;

			@media (min-width: $medium) {
				display: block;
				width: fit-content;
				position: sticky;
				top: var(--space-4);
				left: var(--space-4);
				z-index: 1;
			}
		}

		#scrollable-wrapper {
			position: relative;
			flex: 1;
			overflow-y: auto;
			background-color: var(--color-surface-container-lowest);

			main {
				position: relative;
				padding: var(--space-4);
				max-width: 700px;
				margin: 0 auto;
			}

			@media (min-width: $medium) {
				border-radius: var(--round-xlg);
				margin: var(--space-2);
				margin-left: 0;
			}
		}

		@media (min-width: $medium) {
			padding-left: var(--space-2);
		}
	}
</style>
