<script lang="ts">
	import type { Bookmark, Bookmarks } from '$lib/helpers/bookmark.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import BookmarkComponent from '$lib/components/Bookmark.svelte';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import { getBookmarkKbdActions } from '$lib/helpers/keyboard/bookmark';
	import ContextMenu from './ContextMenu.svelte';
	import { createNavigation } from '$lib/helpers/navigation.svelte';
	import { getBookmarkContextMenuItems } from '$lib/helpers/context-menu/bookmarks';

	let currentBookmark = $state<Bookmark | undefined>();
	let navigation = createNavigation();

	let contextMenuVisible = $state(false);
	let x = $state(0);
	let y = $state(0);
	let listEl = $state<HTMLUListElement>();

	let {
		bookmarks = $bindable()
	}: {
		bookmarks: Bookmarks;
	} = $props();

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

	function useMouse(cb: (x: MouseEvent) => void) {
		return (ev: MouseEvent) => {
			if (contextMenuVisible) return;
			navigation.setState('mouse');
			cb(ev);
		};
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (contextMenuVisible) return;

		if (navigation.state === "keyboard" && currentBookmark) {
			handleKeyboardShortcut(ev, getBookmarkKbdActions(currentBookmark));
		}

		if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
			ev.preventDefault();
			navigation.setState('keyboard');

			const index = bookmarks.findIndex(currentBookmark?.raw.id);
			let newIndex = index;

			if (ev.key === 'ArrowDown' && index < bookmarks.length - 1) {
				newIndex++;
				currentBookmark = bookmarks.at(newIndex);
			}
			if (ev.key === 'ArrowUp' && index > 0) {
				newIndex--;
				currentBookmark = bookmarks.at(newIndex);
			}

			const bmEl = listEl?.children[newIndex];
			const bmElRect = bmEl?.getBoundingClientRect();

			const inputFormEl = document.querySelector("#add-bookmark") as HTMLElement;
			const inputRect = inputFormEl.getBoundingClientRect();
			const inputHeight = inputRect.height + 16;

			if (bmEl && bmElRect && 
				(bmElRect.top - inputHeight < 0 || bmElRect.bottom > window.innerHeight)
			) {
				bmEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

				if (ev.key === "ArrowUp" && bmElRect.top - inputHeight < 0) {
					const scrollableEl = document.getElementById("scrollable-wrapper")!;
					scrollableEl.scrollBy({
						top: -inputHeight,
						behavior: 'smooth'
					});
				}
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
	{#each bookmarks.all as bookmark (bookmark.raw.id)}
		<BookmarkComponent
			active={currentBookmark && currentBookmark.raw.id === bookmark.raw.id}
			{navigation}
			{bookmark}
			onmouseenter={useMouse(() => (currentBookmark = bookmark))}
			onmouseleave={useMouse(() => (currentBookmark = undefined))}
			oncontextmenu={useMouse((ev) => showContextMenu(ev, bookmark))}
		/>
	{/each}
</ul>

<style lang="scss">
	@import '../../styles/vars.scss';

	ul {
		margin: 0 var(--space-2);
		@media (max-width: $compact) {
			margin-bottom: 4rem;
		}
	}
</style>
