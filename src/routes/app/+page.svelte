<script lang="ts">
	import BookmarkList from '$lib/components/BookmarkList.svelte';
	import { bookmarks } from '$lib/helpers/bookmark.svelte';
	import BookmarkInput from './BookmarkInput.svelte';

	const { data } = $props();

	let value = $state('');

	bookmarks.setBookmarks(data.bookmarks);
</script>

<header>
	<h1>Unorganized saves</h1>

	<BookmarkInput bind:value />
</header>

<BookmarkList
	bookmarks={value.length >= 2 ? bookmarks.bookmarks.filter((bm) => bm.raw.title?.toLowerCase()?.includes(value.toLowerCase())!) : bookmarks.bookmarks}
/>

<style lang="scss">
	@import '../../styles/vars.scss';

	header {
		// display: flex;
		// flex-direction: column;

		h1 {
			margin: 0 var(--space-4);
			margin-bottom: 0;

			@media (max-width: $compact) {
				margin: var(--space-4) 0;
			}
		}
	}
</style>
