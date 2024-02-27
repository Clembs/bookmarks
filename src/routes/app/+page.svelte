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
	import autoAnimate from '@formkit/auto-animate';

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
		if (contextMenuVisible) {
			contextMenuVisible = false;
			currentBookmark = undefined;
			return;
		}

		ev.preventDefault();
		currentBookmark = bookmark;
		const element = ev.target as HTMLElement;
		const rect = element.getBoundingClientRect();
		const selectMenuHeight = getBookmarkContextMenuItems(currentBookmark).length * 40 + 8;
		const selectMenuWidth = 200;

		// check context menu collision with the bottom of the screen
		if (rect.top + selectMenuHeight > window.innerHeight) {
			y = window.innerHeight - selectMenuHeight - 16;
		} else {
			y = ev.clientY;
		}
		// TODO: fix whatever i did here
		// check context menu collision with the right of the screen, or the left
		// if (rect.left + selectMenuWidth > window.innerWidth) {
		// 	x = window.innerWidth - selectMenuWidth - 16;
		// } else if (rect.left < selectMenuWidth) {
		// 	x = 16;
		// } else {
		x = ev.clientX;
		// }

		contextMenuVisible = true;
	}

	const { data } = $props();

	let bookmarks = $derived(data.bookmarks.map((b) => new Bookmark(b)));
</script>

<svelte:window
	onkeydown={(ev) => {
		// if it's a letter or number and nothing is focused, focus the text input
		if (
			!ev.ctrlKey &&
			!ev.metaKey &&
			!ev.altKey &&
			!ev.shiftKey &&
			ev.key.length === 1 &&
			!document.activeElement?.matches('input, textarea')
		) {
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
		if (currentBookmark && !contextMenuVisible) {
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

		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === "failure" && result.data?.message) {
				error = result.data.message as string;
			}
			
			if (result.type === "success" && result.data?.bookmark) {
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

<ul use:autoAnimate>
	{#each bookmarks as bookmark (bookmark.raw.id)}
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
		z-index: 1;
		// box-shadow: var(--elevation-2);
		background-color: var(--color-surface);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
</style>
