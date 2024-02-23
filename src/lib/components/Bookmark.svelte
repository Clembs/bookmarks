<script lang="ts">
	import type { BookmarkType } from '$lib/db/types';

	let { bookmark } = $props<{ bookmark: BookmarkType }>();
</script>

<article class="bookmark">
	{#if typeof bookmark === 'string'}
		<div class="bookmark-title">
			{bookmark}
		</div>
	{:else if bookmark.type === 'url'}
		<a href={bookmark.value} target="_blank" rel="noopener noreferrer">
			<img src={bookmark.iconUrl} alt={bookmark.title} />
			<div class="bookmark-title">
				{bookmark.title}
			</div>
			<div class="bookmark-subtext"></div>
		</a>
	{/if}
</article>

<style lang="scss">
	.bookmark {
		border-radius: var(--radii-1);
		padding: var(--space-4);
		display: flex;
	}
</style>
