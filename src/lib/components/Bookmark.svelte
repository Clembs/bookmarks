<script lang="ts">
	import type { Bookmark } from '$lib/helpers/bookmark.svelte';
	import { trimUrl } from '$lib/helpers/trimUrl';

	let { bookmark, active, oncontextmenu } = $props<{
		bookmark: Bookmark;
		active?: boolean;
		oncontextmenu?: (ev: MouseEvent) => void;
	}>();
</script>

{#if bookmark.raw.partial}
	<article class="bookmark" class:active {oncontextmenu}>
		<div class="bookmark-title">
			{bookmark.raw.value}
		</div>
	</article>
{:else if bookmark.raw.type === 'url'}
	<a
		class="bookmark"
		class:active
		{oncontextmenu}
		href={bookmark.raw.value}
		target="_blank"
		rel="noopener noreferrer"
	>
		{#if bookmark.raw.iconUrl}
			<img
				class="bookmark-icon"
				src={bookmark.raw.iconUrl}
				alt={bookmark.raw.title}
				height="24"
				width="24"
			/>
		{:else}
			<div
				class="bookmark-icon fallback"
				style:--color="#{Math.floor(Math.random() * 16777215).toString(16)}"
			>
				{bookmark.raw.title[0]}
			</div>
		{/if}
		<div class="bookmark-info">
			<div class="bookmark-info-title">
				{bookmark.raw.title}
				{#if bookmark.deleteState === 'loading'}
					- loading
				{/if}
			</div>
			<div class="bookmark-info-subtext">
				{trimUrl(bookmark.raw.value)}
			</div>
		</div>
	</a>
{/if}

<style lang="scss">
	.bookmark {
		border-radius: var(--round-xsm);
		padding: var(--space-2) var(--space-3);
		display: flex;
		align-items: center;
		gap: var(--space-2);

		&-icon {
			width: 24px;
			height: 24px;
			display: grid;
			place-items: center;

			&.fallback {
				border-radius: var(--round-full);
				background-color: var(--color);
				color: var(--color-secondary-fixed);
			}
		}

		&-info {
			display: flex;
			flex-direction: column;

			&-subtext {
				font-size: 0.75rem;
				color: var(--color-on-surface-variant);
			}
		}

		&:hover,
		&.active {
			background-color: var(--color-surface-container);
		}
	}
</style>
