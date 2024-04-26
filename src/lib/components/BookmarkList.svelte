<script lang="ts">
	import type { Bookmark } from '$lib/helpers/bookmark.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import BookmarkComponent from '$lib/components/Bookmark.svelte';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import { getBookmarkKbdActions } from '$lib/helpers/keyboard/bookmark';
	import ContextMenu from './ContextMenu.svelte';
	import { getBookmarkContextMenuItems } from '$lib/helpers/context-menu/bookmarks';
	import { Plus } from 'phosphor-svelte';
	import { inputType } from '$lib/helpers/navigation.svelte';

	let currentBookmark = $state<Bookmark | undefined>();

	let contextMenuVisible = $state(false);
	let x = $state(0);
	let y = $state(0);
	let listEl = $state<HTMLUListElement>();

	let {
		bookmarks = $bindable()
	}: {
		bookmarks: Bookmark[];
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
			inputType.set('mouse');
			cb(ev);
		};
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (contextMenuVisible) return;

		if (inputType.state === "keyboard" && currentBookmark) {
			handleKeyboardShortcut(ev, getBookmarkKbdActions(currentBookmark));
		}

		if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
			ev.preventDefault();
			inputType.set('keyboard');

			const index = bookmarks.findIndex(({ raw }) => raw.id === currentBookmark?.raw.id);
			let newIndex = index;
			
			if (ev.key === 'ArrowDown' && index < bookmarks.length - 1) {
				newIndex++;
			}
			if (ev.key === 'ArrowUp' && index > 0) {
				newIndex--;
			}

			if (newIndex !== -1) {
				currentBookmark = bookmarks[newIndex];
				
				const bmEl = listEl?.children[newIndex] as HTMLElement;
				const bmElRect = bmEl?.getBoundingClientRect();
				bmEl.focus();

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
	{#if bookmarks.length}
		{#each bookmarks as bookmark (bookmark.raw.id)}
			<BookmarkComponent
				active={currentBookmark && currentBookmark.raw.id === bookmark.raw.id}
				{bookmark}
				onmouseenter={useMouse(() => (currentBookmark = bookmark))}
				onmouseleave={useMouse(() => (currentBookmark = undefined))}
				oncontextmenu={useMouse((ev) => showContextMenu(ev, bookmark))}
			/>
		{/each}
	{:else}
		<button
			on:click={() => {
			const form = document.getElementById('add-bookmark') as HTMLFormElement;
			form.requestSubmit();
		}}
			id="add-to-saves"
		>
			<Plus /> Add to saves
		</button>
	{/if}
</ul>

<style lang="scss">
	@import '../../styles/vars.scss';

	ul {
		margin: 0 var(--space-2);

		@media (max-width: $compact) {
			margin: calc(0px - var(--space-2));
			margin-bottom: 5rem;
		}
	}

	#add-to-saves {
		display: flex;
		border-radius: var(--round-md);
		padding: var(--space-2);
		display: flex;
		gap: var(--space-2);
		width: 100%;
		transition: background-color var(--transition-in-out-standard);

		&:hover {
			background-color: var(--color-surface-container);
		}
	}
</style>
