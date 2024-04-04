<script lang="ts">
	import { enhance } from '$app/forms';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Bookmark } from '$lib/helpers/bookmark.svelte';
	import BookmarkList from '$lib/components/BookmarkList.svelte';

	let value = $state('');
	let error = $state('');
	let textInput = $state<HTMLInputElement | HTMLTextAreaElement | undefined>();
	let form = $state<HTMLFormElement | undefined>();

	const { data } = $props();

	let bookmarks = $derived(data.bookmarks.map((b) => new Bookmark(b)));
</script>

<svelte:window
	onkeydown={(ev) => {
		const isNothingFocused = !document.activeElement?.matches('input, textarea');
		// if it's a letter or number and nothing is focused, focus the text input
		if (
			!ev.ctrlKey &&
			!ev.metaKey &&
			!ev.altKey &&
			!ev.shiftKey &&
			ev.key.length === 1 &&
			isNothingFocused
		) {
			textInput?.focus();
		}
		if ((ev.ctrlKey || ev.metaKey) && ev.key === 'f') {
			ev.preventDefault();
			textInput?.focus();
		}
		if ((ev.ctrlKey || ev.metaKey) && ev.key === 'v' && textInput && form && isNothingFocused) {
			textInput.focus();
			form.requestSubmit();
		}
	}}
/>

<header>
	<h1>All bookmarks</h1>

	<form
		id="add-bookmark"
		method="post"
		bind:this={form}
		use:enhance={() => {
			console.log("h");
			// optimistic update
			data.bookmarks.push({
				title: value,
				value,
				partial: true,
			});
	
			return async ({ result, update }) => {
				// data.bookmarks.pop();
	
				if (result.type === "failure" && result.data?.message) {
					error = result.data.message as string;
				}
				
				// if (result.type === "success" && result.data?.bookmark) {
					// data.bookmarks.push(
					// 	result.data.bookmark as RawBookmark
					// );
				// }
				return await update();
			}
		}}
	>
		<!-- bind:error -->
		<TextInput
			type="text"
			bind:value
			bind:el={textInput}
			name="raw"
			placeholder="Add a URL, a color, code, or whatever else..."
		/>
	</form>
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
