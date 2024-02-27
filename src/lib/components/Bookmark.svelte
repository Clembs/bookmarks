<script lang="ts">
	import { type Bookmark, urlTypeBookmarks } from '$lib/helpers/bookmark.svelte';
	import { trimUrl } from '$lib/helpers/trimUrl';
	import { Text_snippet } from 'svelte-google-materialdesign-icons';
	import IndeterminateProgressSpinner from './IndeterminateProgressSpinner.svelte';
	import { YOUTUBE_VIDEO_REGEX } from '$lib/validation';

	let { bookmark, active, oncontextmenu } = $props<{
		bookmark: Bookmark;
		active?: boolean;
		oncontextmenu?: (ev: MouseEvent) => void;
	}>();
</script>

{#snippet bookmarkContent(bookmark: Bookmark)}
	<div class="bookmark-content">
		{#if bookmark.raw.partial}
			<IndeterminateProgressSpinner />
			<div class="bookmark-info-title">
				{bookmark.raw.title}
			</div>
		{:else}
			{#if bookmark.isLoading}
				<IndeterminateProgressSpinner />
			{:else if bookmark.raw.iconUrl}
				<img
					class="bookmark-icon"
					src={bookmark.raw.iconUrl}
					alt={bookmark.raw.title}
					height="24"
					width="24"
				/>
			{:else if bookmark.raw.type === 'url'}
				<div
					class="bookmark-icon fallback"
					style:--color="#{Math.floor(Math.random() * 16777215).toString(16)}"
				/>
			{:else}
				<div class="bookmark-icon">
					<Text_snippet />
				</div>
			{/if}
			<div class="bookmark-info">
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
					<div class="bookmark-info-subtext hint">Click to copy</div>
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

{#if bookmark.raw.partial}
	<article class="bookmark" class:active {oncontextmenu}>
		{@render bookmarkContent(bookmark)}
	</article>
{:else if urlTypeBookmarks.includes(bookmark.raw.type)}
	<a
		class="bookmark"
		class:active
		{oncontextmenu}
		href={bookmark.raw.value}
		target="_blank"
		rel="noopener noreferrer"
	>
		{@render bookmarkContent(bookmark)}
	</a>
{:else}
	<button
		onclick={() => {
			bookmark.raw.value && navigator.clipboard.writeText(bookmark.raw.value);
		}}
		class="bookmark"
		class:active
		{oncontextmenu}
	>
		{@render bookmarkContent(bookmark)}
	</button>
{/if}

<style lang="scss">
	.bookmark {
		border-radius: var(--round-xsm);
		padding: var(--space-2) var(--space-3);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);

		&-content {
			display: flex;
			align-items: center;
			gap: var(--space-2);
		}

		&-icon {
			width: 24px;
			height: 24px;
			display: grid;
			place-items: center;

			&.fallback {
				border-radius: var(--round-full);
				background-color: var(--color);
				color: var(--color-secondary-fixed);
			}
		}

		&-info {
			display: flex;
			flex-direction: column;

			&-title {
				// max width 50ch, otherwise ellipsis, wrap on word
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				max-width: 40ch;
				word-wrap: break-word;

				&:has(.hint) {
					translate: 0 0.5rem;
					transition: translate var(--transition-in-out-standard);
					will-change: translate;
				}
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
			max-width: 200px;
			margin-left: var(--space-8);
		}

		&:hover,
		&.active {
			background-color: var(--color-surface-container);

			:global(.bookmark-info-title) {
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
