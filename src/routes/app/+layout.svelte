<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	let isSidebarOpen = $state(false);
</script>

<div id="layout">
	<aside aria-checked={isSidebarOpen}>
		<div id="title">Bookmarks</div>

		<ul id="top-items">
			<a data-active={$page.url.pathname === '/app'} href="/app">All bookmarks</a>
			{#each data.categories as category (category.id)}
				<a data-active={$page.url.pathname === '/app'} href="/app/{category.id}">{category.name}</a>
			{/each}
		</ul>

		<ul id="bottom-items">
			<a href="/settings">Settings</a>
		</ul>
	</aside>

	<main>
		{@render children()}
	</main>
</div>

<style lang="scss">
	#layout {
		display: flex;
		gap: var(--space-2);
		height: 100vh;

		aside {
			width: 360px;
			height: 100%;
			position: sticky;
			top: 0;
			display: flex;
			flex-direction: column;
			padding: var(--space-3);
			background-color: var(--color-surface-container-low);
			color: var(--color-on-surface-variant);
			border-radius: 0 var(--round-lg) var(--round-lg) 0;

			#title {
				font-size: 1.5rem;
				font-family: var(--fonts-headings);
				font-weight: 600;
				padding: var(--space-4);
			}

			ul {
				display: flex;
				flex-direction: column;
				gap: var(--space-1);

				a {
					display: flex;
					align-items: center;
					width: 100%;
					padding: var(--space-4) var(--space-6);
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

		main {
			padding: var(--space-4);
			flex: 1;
			overflow-y: auto;
		}
	}
</style>
