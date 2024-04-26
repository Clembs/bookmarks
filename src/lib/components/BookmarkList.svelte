<script lang="ts">
	import type { Bookmark } from '$lib/helpers/bookmark.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import BookmarkComponent from '$lib/components/Bookmark.svelte';
	import { handleKeyboardShortcut } from '$lib/helpers/keyboard/handler';
	import { getBookmarkKbdActions } from '$lib/helpers/keyboard/bookmark';
	import { contextMenu, inputType } from '$lib/helpers/navigation.svelte';

	let currentBookmark = $state<Bookmark | undefined>();

	let listEl = $state<HTMLUListElement>();

	let {
		bookmarks = $bindable()
	}: {
		bookmarks: Bookmark[];
	} = $props();

	function useMouse(cb: (x: MouseEvent) => void) {
		return (ev: MouseEvent) => {
			if (contextMenu.state.state === 'open') return;
			inputType.set('mouse');
			cb(ev);
		};
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (contextMenu.state.state === 'open') return;

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

<ul use:autoAnimate bind:this={listEl}>
	{#each bookmarks as bookmark (bookmark.raw.id)}
		<BookmarkComponent
			active={currentBookmark && currentBookmark.raw.id === bookmark.raw.id}
			{bookmark}
			onmouseenter={useMouse(() => (currentBookmark = bookmark))}
			onmouseleave={useMouse(() => (currentBookmark = undefined))}
		/>
	{/each}
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
