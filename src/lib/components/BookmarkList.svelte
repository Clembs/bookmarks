<script lang="ts">
	import type { Bookmark } from '$lib/helpers/bookmark.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import BookmarkComponent from '$lib/components/Bookmark.svelte';
	import { getBookmarkContextMenuItems } from '../../routes/app/helpers';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import { getBookmarkKbdActions } from '$lib/helpers/keyboard/bookmark';
	import ContextMenu from './ContextMenu.svelte';

	let currentBookmark = $state<Bookmark | undefined>();

	let contextMenuVisible = $state(false);
	let x = $state(0);
	let y = $state(0);
	let listEl = $state<HTMLUListElement>();

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

	let { bookmarks } = $props<{
		bookmarks: Bookmark[];
	}>();
</script>

<svelte:window
	onkeydown={(ev) => {
		if (currentBookmark && !contextMenuVisible) {
			handleKeyboardShortcut(ev, getBookmarkKbdActions(currentBookmark));
		}

		if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
			ev.preventDefault();
			const index = bookmarks.findIndex((b) => b.raw.id === currentBookmark?.raw.id);

			if (ev.key === 'ArrowDown' && index < bookmarks.length - 1) {
				currentBookmark = bookmarks[index + 1];
			}
			if (ev.key === 'ArrowUp' && index > 0) {
				currentBookmark = bookmarks[index - 1];
			}

			const element = listEl?.children[index + 1];
			const rect = element?.getBoundingClientRect();

			if (element && rect && (rect.top < 0 || rect.bottom > window.innerHeight)) {
				element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
			}
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

<ul use:autoAnimate bind:this={listEl}>
	{#each bookmarks as bookmark (bookmark.raw.id)}
		<BookmarkComponent
			active={currentBookmark && currentBookmark.raw.id === bookmark.raw.id}
			{bookmark}
			oncontextmenu={(ev) => showContextMenu(ev, bookmark)}
		/>
	{/each}
</ul>
