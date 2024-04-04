<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Menu, Menu_open, Add } from 'svelte-google-materialdesign-icons';
	import Sidebar from './Sidebar.svelte';

	let { children, data } = $props();

	let isSidebarOpen = $state(false);
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
	#layout {
		display: flex;
		height: 100vh;
		background-color: var(--color-surface-container-low);
		padding-left: var(--space-2);

		#menu-btn {  
			width: fit-content;
			position: sticky;
			top: var(--space-4);
			left: var(--space-4);
			z-index: 1;
		}

		#scrollable-wrapper {
			position: relative;
			flex: 1;
			overflow-y: auto;
			background-color: var(--color-surface-container-lowest);
			border-radius: var(--round-xlg);
			margin: var(--space-2);
			margin-left: 0;

			main {
				position: relative;
				padding: var(--space-2);
				max-width: 700px;
				margin: 0 auto;
			}
		}
	}
</style>
