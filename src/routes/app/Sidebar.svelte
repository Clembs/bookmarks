<script lang="ts">
	import { page } from '$app/stores';
	import { Settings, Add } from 'svelte-google-materialdesign-icons';
	import Dialog from '$lib/components/Dialog.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let { isSidebarOpen = $bindable() } = $props();
	let isCreationModalOpen = $state(false);

	$effect(() => {
		const isExpanded = window.matchMedia('(min-width: 1200px)').matches;

		isSidebarOpen = isExpanded;
	});
</script>

<Dialog
	bind:showModal={isCreationModalOpen}
	headline="Create category"
	actions={[
		{
			label: 'Cancel',
			action: () => (isCreationModalOpen = false)
		},
		{
			label: 'Create',
			action: 'submit',
			type: 'filled'
		}
	]}
	onclose={() => (isCreationModalOpen = false)}
>
	<form method="post" action="/api/category?">
		<TextInput name="name" label="Name" required autofocus />
	</form>
</Dialog>

<svelte:window
	onresize={(ev) => {
		const isExpanded = window.matchMedia('(min-width: 1200px)').matches;

		isSidebarOpen = isExpanded;
	}}
/>

<div id="sidebar-wrapper" data-active={isSidebarOpen}>
	<aside>
		<div id="title">saveit</div>

		<ul id="top-items">
			<a class="item" data-active={$page.url.pathname === '/app'} href="/app">All saves</a>
			{#each $page.data.categories as category (category.id)}
				<a
					class="item"
					data-active={$page.url.pathname === `/app/${category.id}`}
					href="/app/{category.id}"
				>
					{category.name}
				</a>
			{/each}
			<button class="item" onclick={() => (isCreationModalOpen = true)}>
				<Add size="20" />
				Create folder
			</button>
		</ul>

		<ul id="bottom-items">
			<a class="item" href="/settings">
				<Settings size="20" />
				Settings
			</a>
		</ul>
	</aside>
</div>

<style lang="scss">
	@import '../../styles/vars.scss';

	#sidebar-wrapper {
		min-width: 360px;
		overflow: hidden;
		width: 0;
		background-color: var(--color-surface-container-low);
		color: var(--color-on-surface-variant);
		border-radius: 0 var(--round-lg) var(--round-lg) 0;

		// transition: min-width 200ms linear;

		transition: min-width var(--transition-enter-screen-emphasized);
		// will-change: min-width;
		z-index: 1;

		:global(svg) {
			flex-shrink: 0;
		}

		&[data-active='false'] {
			min-width: 0;
			padding: 0;
			transition: min-width var(--transition-exit-screen-emphasized);
			// will-change: min-width;
		}
	}

	aside {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 360px;
		overflow-x: hidden;
		// overflow-y: scroll;
		z-index: 9;
		padding: var(--space-3);
		// transition:
		// 	translate var(--transition-enter-screen-emphasized),
		// 	opacity var(--transition-enter-screen-emphasized);
		// will-change: translate, opacity;

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

			.item {
				display: flex;
				align-items: center;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				text-wrap: nowrap;
				white-space: nowrap;
				gap: var(--space-3);
				padding: var(--space-3) var(--space-4);
				border-radius: var(--round-md);
				color: var(--color-on-surface-variant);
				text-decoration: none;

				&:hover {
					background-color: var(--color-surface-container);
				}

				&[data-active] {
					background-color: var(--color-surface-container-highest);
					color: var(--color-on-surface);
					font-weight: 500;
				}
			}

			&#bottom-items {
				margin-top: auto;
			}
		}
	}
</style>
