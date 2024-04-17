<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Menu, Menu_open } from 'svelte-google-materialdesign-icons';
	import Sidebar from './Sidebar.svelte';

	let { children, data } = $props();

	let isSidebarOpen = $state(!data.isMobile || false);
</script>

<div id="layout">
	<Sidebar bind:isSidebarOpen />

	<div id="scrollable-wrapper">
		<div id="menu-btn">
			<Button
				style="text"
				icon
				onclick={() => {
					isSidebarOpen = !isSidebarOpen;
				}}
			>
			{#if isSidebarOpen}
				<Menu_open />
			{:else}
				<Menu />
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
				padding: var(--space-2);
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
