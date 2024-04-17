<script lang="ts">
	import { Bookmarks } from '$lib/helpers/bookmark.svelte';
	import BookmarkList from '$lib/components/BookmarkList.svelte';
	import BookmarkInput from './BookmarkInput.svelte';

	const { data } = $props();

	let bookmarks = $state(new Bookmarks(data.bookmarks));
</script>

<header>
	<h1>All saves</h1>

	<BookmarkInput {bookmarks} />
</header>

<BookmarkList {bookmarks} />

<style lang="scss">
	@import '../../styles/vars.scss';

	header {
		display: flex;
		flex-direction: column;
		margin-bottom: var(--space-4);

		h1 {
			margin-bottom: 0;
		}

		form {
			position: sticky;
			top: 0;
			left: 0;
			z-index: 1;
			padding-top: var(--space-4);
		}
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
</style>
