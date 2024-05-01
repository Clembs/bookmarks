<script lang="ts">
	import BookmarkList from '$lib/components/BookmarkList.svelte';
	import { Bookmark } from '$lib/helpers/bookmark.svelte';
	import BookmarkInput from '../BookmarkInput.svelte';

	const { data } = $props();

	let value = $state('');

	let bookmarks = $state(data.bookmarks.map((bookmark) => new Bookmark(bookmark)));

	$effect(() => {
		bookmarks = data.bookmarks.map((bookmark) => new Bookmark(bookmark));
	})
</script>

<header>
	<h1>{data.category.name}</h1>

	<BookmarkInput bind:bookmarks bind:value categoryId={data.category.id} />
</header>

{#key bookmarks}
	<BookmarkList
		bookmarks={value.length >= 2 ? bookmarks.filter((bm) => bm.raw.title?.toLowerCase()?.includes(value.toLowerCase())!) : bookmarks}
	/>
{/key}

<style lang="scss">
	@import '../../../styles/vars.scss';

	header {
		h1 {
			margin: 0 var(--space-4);
			margin-bottom: 0;

			@media (max-width: $compact) {
				margin: var(--space-4) 0;
			}
		}
	}
</style>
