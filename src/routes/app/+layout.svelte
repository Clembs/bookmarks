<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { Menu, Settings, Menu_open } from 'svelte-google-materialdesign-icons';

	let { children, data } = $props();

	let isSidebarOpen = $state(false);

	$effect(() => {
		const isExpanded = window.matchMedia('(min-width: 840px)').matches;

		if (isExpanded) {
			isSidebarOpen = true;
		}
	});
</script>

<svelte:window
	onresize={(ev) => {
		const isExpanded = window.matchMedia('(min-width: 840px)').matches;

		isSidebarOpen = isExpanded;
	}}
/>

{#snippet toggleButton(type: "close" | 'open')}
	<Button style="text" icon onclick={() => (isSidebarOpen = type === 'open')}>
		{#if type === 'close'}
			<Menu_open />
		{:else}
			<Menu />
		{/if}
	</Button>
{/snippet}

<div id="layout">
	<div id="menu-btn">
		{@render toggleButton('open')}
	</div>

	<div id="sidebar-wrapper" data-active={isSidebarOpen}>
		<aside>
			<div id="title">
				Bookmarks
				{@render toggleButton('close')}
			</div>

			<ul id="top-items">
				<a data-active={$page.url.pathname === '/app'} href="/app">All bookmarks</a>
				{#each data.categories as category (category.id)}
					<a data-active={$page.url.pathname === `/app/${category.id}`} href="/app/{category.id}">
						{category.name}
					</a>
				{/each}
			</ul>

			<ul id="bottom-items">
				<a href="/settings">
					<Settings size="24" />
					Settings
				</a>
			</ul>
		</aside>
	</div>

	<div id="scrollable-wrapper">
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

		#menu-btn {
			position: fixed;
			top: var(--space-4);
			left: var(--space-4);
			z-index: 0;
		}

		#sidebar-wrapper {
			min-width: 360px;
			overflow: hidden;
			width: 0;
			background-color: var(--color-surface-container-low);
			color: var(--color-on-surface-variant);
			border-radius: 0 var(--round-lg) var(--round-lg) 0;
			transition: min-width var(--transition-enter-screen-emphasized);
			will-change: min-width;
			z-index: 1;

			:global(svg) {
				flex-shrink: 0;
			}

			&[data-active='false'] {
				min-width: 0;
				padding: 0;
				transition: min-width var(--transition-exit-screen-emphasized);
				will-change: min-width;

				aside {
					translate: -24px;
					opacity: 0;
					transition:
						translate var(--transition-exit-screen-emphasized),
						opacity var(--transition-exit-screen-emphasized);
					will-change: translate, opacity;
				}
			}
		}

		aside {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow-x: hidden;
			// overflow-y: scroll;
			z-index: 9;
			padding: var(--space-3);
			transition:
				translate var(--transition-enter-screen-emphasized),
				opacity var(--transition-enter-screen-emphasized);
			will-change: translate, opacity;

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

				a {
					display: flex;
					align-items: center;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					text-wrap: nowrap;
					white-space: nowrap;
					height: var(--space-9);
					gap: var(--space-4);
					padding: var(--space-2) var(--space-4);
					border-radius: var(--round-full);
					color: var(--color-on-surface-variant);
					text-decoration: none;

					&:hover {
						background-color: var(--color-surface-container);
					}

					&[data-active] {
						background-color: var(--color-secondary-container);
						color: var(--color-on-secondary-container);
						font-weight: 500;
					}
				}

				&#bottom-items {
					margin-top: auto;
				}
			}
		}

		#scrollable-wrapper {
			flex: 1;
			overflow-y: auto;

			main {
				position: relative;
				padding: var(--space-4);
				max-width: 700px;
				margin: 0 auto;
			}
		}
	}
</style>
