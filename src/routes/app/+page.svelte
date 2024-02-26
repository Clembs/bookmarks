<script lang="ts">
	import { enhance } from '$app/forms';
	import BookmarkComponent from '$lib/components/Bookmark.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { getBookmarkContextMenuItems } from './helpers';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import { getBookmarkKbdActions } from '$lib/helpers/keyboard/bookmark';
	import { Bookmark } from '$lib/helpers/bookmark.svelte';
	import type { RawBookmark } from '$lib/db/types';

	let value = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let textInput = $state<HTMLInputElement | HTMLTextAreaElement | undefined>();
	let form = $state<HTMLFormElement | undefined>();

	let currentBookmark = $state<Bookmark | undefined>();
	let contextMenuVisible = $state(false);
	let x = $state(0);
	let y = $state(0);

	function showContextMenu(ev: MouseEvent, bookmark: Bookmark) {
		ev.preventDefault();
		x = ev.clientX;
		y = ev.clientY;
		contextMenuVisible = true;
		currentBookmark = bookmark;
	}

	const { data } = $props();

	let bookmarks = $derived(data.bookmarks.map((b) => new Bookmark(b)));
</script>

<svelte:window
	onkeydown={(ev) => {
		// if it's a letter or number, focus the input
		if (ev.key.length === 1) {
			textInput?.focus();
		}
		if ((ev.ctrlKey || ev.metaKey) && ev.key === 'f') {
			ev.preventDefault();
			textInput?.focus();
		}
		if ((ev.ctrlKey || ev.metaKey) && ev.key === 's') {
			ev.preventDefault();
			textInput?.focus();
			form?.submit();
		}
		if (currentBookmark) {
			handleKeyboardShortcut(ev, getBookmarkKbdActions(currentBookmark));
		}
	}}
/>

{#if contextMenuVisible && currentBookmark}
	<ContextMenu
		bind:visible={contextMenuVisible}
		{x}
		{y}
		items={getBookmarkContextMenuItems(currentBookmark)}
		onclose={() => (currentBookmark = undefined)}
	/>
{/if}

<h1>Bookmarks</h1>

<form
	method="post"
	bind:this={form}
	use:enhance={() => {
		isLoading = true;
		bookmarks.push(new Bookmark({
			value,
			partial: true,
		}));

		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === "failure" && result.data?.message) {
				error = result.data.message as string;
			}
			
			if (result.type === "success" && result.data?.bookmark) {
				console.log(result.data);
				bookmarks.pop();
				bookmarks.push(new Bookmark(result.data.bookmark as RawBookmark));
			}
			return await update();
		}
	}}
>
	<TextInput
		type="text"
		bind:error
		bind:value
		bind:el={textInput}
		name="raw"
		placeholder="Add a URL, a color, code, or whatever else..."
	/>
</form>

<ul>
	{#each bookmarks as bookmark}
		<BookmarkComponent
			active={currentBookmark && currentBookmark.raw.id === bookmark.raw.id}
			{bookmark}
			oncontextmenu={(ev) => showContextMenu(ev, bookmark)}
		/>
	{/each}
</ul>

<style lang="scss">
	form {
		position: sticky;
		top: 0.5rem;
		left: 0;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
</style>
