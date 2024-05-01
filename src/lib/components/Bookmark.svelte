<script lang="ts">
	import {
		type Bookmark,
		urlTypeBookmarks, copyTypeBookmarks
	} from '$lib/helpers/bookmark.svelte';
	import { trimUrl } from '$lib/helpers/trimUrl';
	import IndeterminateProgressSpinner from './IndeterminateProgressSpinner.svelte';
	import { YOUTUBE_VIDEO_REGEX } from '$lib/validation';
	import { Globe, TextAlignLeft } from 'phosphor-svelte';
	import { contextMenu, inputType } from '$lib/helpers/navigation.svelte';
	import { getBookmarkContextMenuItems } from '$lib/helpers/context-menu/bookmarks';

	let {
		bookmark,
		active,
		...mouseEvents
	}: {
		bookmark: Bookmark;
		active?: boolean;
		onmouseenter?: (ev: MouseEvent) => void;
		onmouseleave?: (ev: MouseEvent) => void;
		onfocus?: (ev: FocusEvent) => void;
		onblur?: (ev: FocusEvent) => void;
	} = $props();

	let textFieldEl = $state<HTMLInputElement>();
	let newTitle = $state(bookmark.raw.title!);

	async function submitRename() {
		if (!bookmark.isRenaming) return;

		bookmark.raw.title = newTitle;
		bookmark.setRenaming(false);
		await bookmark.rename(newTitle);
	}

	function showContextMenu(ev: MouseEvent) {
		contextMenu.open(ev, getBookmarkContextMenuItems(bookmark));
	}

	function dragStart(ev: DragEvent) {
		if (!ev.dataTransfer) return;

		ev.dataTransfer.clearData();
		ev.dataTransfer.effectAllowed = 'move';
		ev.dataTransfer.setData('text/plain', `bm/${bookmark.raw.categoryId || ''}/${bookmark.raw.id}`);

		if (ev.target instanceof HTMLElement) {
			ev.target.style.opacity = '0.5';
		}
	}

	function dragEnd(ev: DragEvent) {
		if (ev.target instanceof HTMLElement) {
			ev.target.style.opacity = '';
		}
	}

	let baseProps = $derived({
		class: `bookmark ${active ? 'active' : ''}`,
		...mouseEvents
	});
</script>

<svelte:window
	onclick={(ev) => {
		// TODO: if the click is outside of the text field, submit the renam
	}}
	onkeydown={(ev) => {
		if (bookmark.isRenaming) {
			if (ev.key === 'Escape') {
				bookmark.setRenaming(false);
				newTitle = bookmark.raw.title!;
			}
			if (ev.key === 'Enter') {
				submitRename();
			}
		}
	}}
/>

{#snippet bookmarkContent(bookmark: Bookmark)}
	<div class="bookmark-content">
		{#if bookmark.raw.partial}
			<IndeterminateProgressSpinner size={24} />
			<div class="bookmark-info-title">
				{bookmark.raw.title}
			</div>
		{:else}
			{#if bookmark.isLoading}
				<IndeterminateProgressSpinner size={24} />
			{:else if bookmark.raw.iconUrl}
				<img
					class="bookmark-icon"
					src={bookmark.raw.iconUrl}
					alt={bookmark.raw.title}
					height="24"
					width="24"
				/>
			{:else if bookmark.raw.type === 'url'}
				<div class="bookmark-icon">
					<Globe size="24" />
				</div>
			{:else}
				<div class="bookmark-icon">
					<TextAlignLeft size="24" />
				</div>
			{/if}

			<div class="bookmark-info">
				{#if bookmark.isRenaming}
					<input
						class="bookmark-info-title-edit"
						type="text"
						autofocus
						name="title"
						bind:value={newTitle}
						bind:this={textFieldEl}
					/>
					<div class="bookmark-info-subtext">Esc to cancel, Enter to save</div>
				{:else}
					<div class="bookmark-info-title">
						{bookmark.raw.title}
					</div>

					{#if bookmark.raw.type === 'url'}
						<div class="bookmark-info-subtext">
							{trimUrl(bookmark.raw.value)}
						</div>
					{:else if bookmark.raw.type === 'youtube' && bookmark.raw.metadata}
						<div class="bookmark-info-subtext">
							{bookmark.raw.metadata.authorName}
							• youtube.com
						</div>
					{:else}
						<div class="bookmark-info-subtext hint">
							{#if inputType.state === 'keyboard'}
								Enter to copy
							{:else}
								Click to copy
							{/if}
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
	{#if bookmark.raw.type === 'youtube' && bookmark.raw.metadata}
		<img
			src="https://img.youtube.com/vi/{bookmark.raw.metadata.videoId || bookmark.raw.value!.match(YOUTUBE_VIDEO_REGEX)![1]}/mqdefault.jpg"
			alt="Thumbnail for {bookmark.raw.title}"
			class="bookmark-thumbnail"
		/>
	{/if}
{/snippet}

<li
	data-bookmark-id={bookmark.raw.id}
	oncontextmenu={showContextMenu}
	draggable={!bookmark.raw.partial}
	ondragstart={dragStart}
	ondragend={dragEnd}
>
	{#if bookmark.raw.partial}
		<button {...baseProps}>
			{@render bookmarkContent(bookmark)}
		</button>
	{:else if urlTypeBookmarks.includes(bookmark.raw.type) && !bookmark.isRenaming}
		<a
			href={bookmark.raw.value}
			target="_blank"
			rel="noopener noreferrer"
			{...baseProps}
		>
			{@render bookmarkContent(bookmark)}
		</a>
	{:else if copyTypeBookmarks.includes(bookmark.raw.type) && !bookmark.isRenaming}
		<button
			onclick={() => {
				bookmark.raw.value && navigator.clipboard.writeText(bookmark.raw.value);
			}}
			{...baseProps}
		>
			{@render bookmarkContent(bookmark)}
		</button>
	{:else}
		<button {...baseProps}>
			{@render bookmarkContent(bookmark)}
		</button>
	{/if}
</li>

<style lang="scss">
	@import '../../styles/mixins.scss';
	@import '../../styles/vars.scss';

	.bookmark {
		border-radius: var(--round-md);
		padding: var(--space-2);
		display: flex;
		gap: var(--space-2);
		width: 100%;
		transition: background-color var(--transition-in-out-standard);

		@media (max-width: $compact) {
			padding: var(--space-3);
			gap: var(--space-3);
		}

		&-content {
			display: flex;
			align-items: center;
			gap: var(--space-2);
			width: 100%;
		}

		&-icon {
			min-width: 24px;
			min-height: 24px;
			display: grid;
			place-items: center;
		}

		&-info {
			display: flex;
			flex-direction: column;
			flex: 1;
			width: 100%;

			&-title {
				overflow: hidden;
				text-overflow: ellipsis;
				// white-space: nowrap;
				// max-width: 80%;
				word-wrap: break-word;
			}

			&-title-edit {
				// make it look like contenteditable text
				border: none;
				border-bottom: 1px solid var(--color-on-surface-variant);
				background-color: transparent;
				font-family: inherit;
				font-size: 1rem;
				color: inherit;
				width: 100%;
				padding: 0;

				&:focus {
					outline: none;
					border-color: var(--color-primary);
				}

				@include focus-visible(0px);
			}

			&:has(.hint) &-title {
				translate: 0 0.5rem;
				transition: translate var(--transition-in-out-standard);
				will-change: translate;
			}

			&-subtext {
				font-size: 0.75rem;
				color: var(--color-on-surface-variant);

				a:hover {
					text-decoration: underline;
				}

				&.hint {
					opacity: 0;
					translate: 0 -0.5rem;
					transition:
						translate 200ms ease,
						opacity 200ms ease;
					will-change: translate, opacity;
				}
			}
		}

		&-thumbnail {
			border-radius: var(--round-xsm);
			width: 100%;
			height: 100%;
			max-width: 100px;
			flex-shrink: 0;

			@media (max-width: $compact) {
				display: none;
			}
		}

		// &:hover,
		&.active {
			background-color: var(--color-surface-container);

			:global(.bookmark-info .bookmark-info-title) {
				translate: 0 0;
				transition: translate var(--transition-in-out-standard) 300ms;
				will-change: translate, opacity;
			}

			:global(.hint) {
				opacity: 1;
				translate: 0 0;
				transition:
					translate var(--transition-in-out-standard) 300ms,
					opacity var(--transition-in-out-standard) 300ms;
				will-change: translate, opacity;
			}
		}
	}
</style>
