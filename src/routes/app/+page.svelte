<script lang="ts">
	import { Bookmarks } from '$lib/helpers/bookmark.svelte';
	import BookmarkList from '$lib/components/BookmarkList.svelte';
	import BookmarkInput from './BookmarkInput.svelte';

	const { data } = $props();

	let value = $state('');

	let bookmarks = $derived(new Bookmarks(data.bookmarks));
</script>

<header>
	<h1>All saves</h1>

	<BookmarkInput {bookmarks} bind:value />
</header>

<BookmarkList
	bookmarks={value.length >= 2 ? bookmarks.filter((bm) => bm.raw.title?.toLowerCase()?.includes(value.toLowerCase())!) : bookmarks}
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
