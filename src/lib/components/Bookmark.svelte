<script lang="ts">
	import type { BookmarkType } from '$lib/db/types';
	import { trimUrl } from '$lib/helpers/trimUrl';

	let { bookmark, active } = $props<{
		bookmark: BookmarkType;
		active?: boolean;
	}>();
</script>

{#if bookmark.partial}
	<article class="bookmark" class:active>
		<div class="bookmark-title">
			{bookmark.value}
		</div>
	</article>
{:else if bookmark.type === 'url'}
	<a class="bookmark" class:active href={bookmark.value} target="_blank" rel="noopener noreferrer">
		{#if bookmark.iconUrl}
			<img
				class="bookmark-icon"
				src={bookmark.iconUrl}
				alt={bookmark.title}
				height="24"
				width="24"
			/>
		{:else}
			<div
				class="bookmark-icon fallback"
				style:--color="#{Math.floor(Math.random() * 16777215).toString(16)}"
			>
				{bookmark.title[0]}
			</div>
		{/if}
		<div class="bookmark-info">
			<div class="bookmark-info-title">
				{bookmark.title}
			</div>
			<div class="bookmark-info-subtext">
				{trimUrl(bookmark.value)}
			</div>
		</div>
	</a>
{/if}

<style lang="scss">
	.bookmark {
		border-radius: var(--radii-1);
		padding: var(--space-2);
		display: flex;
		align-items: center;
		gap: var(--space-2);

		&-icon {
			width: 24px;
			height: 24px;
			display: grid;
			place-items: center;

			&.fallback {
				border-radius: var(--radii-round);
				background-color: var(--color);
				color: var(--color-on-primary);
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
			background-color: var(--color-surface-variant);
		}
	}
</style>
