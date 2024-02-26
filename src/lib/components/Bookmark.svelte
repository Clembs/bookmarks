<script lang="ts">
	import type { Bookmark } from '$lib/helpers/bookmark.svelte';
	import { trimUrl } from '$lib/helpers/trimUrl';
	import { Text_snippet } from 'svelte-google-materialdesign-icons';

	let { bookmark, active, oncontextmenu } = $props<{
		bookmark: Bookmark;
		active?: boolean;
		oncontextmenu?: (ev: MouseEvent) => void;
	}>();
</script>

{#snippet bookmarkContent(bookmark: Bookmark)}
	{#if bookmark.raw.partial}{:else}
		{#if bookmark.raw.iconUrl}
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
				{#if bookmark.deleteState === 'loading'}
					- loading
				{/if}
			</div>
			{#if bookmark.raw.type === 'url'}
				<div class="bookmark-info-subtext">
					{trimUrl(bookmark.raw.value)}
				</div>
			{:else}
				<div class="bookmark-info-subtext hint">Click to copy</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#if bookmark.raw.partial}
	<article class="bookmark" class:active {oncontextmenu}>
		{@render bookmarkContent(bookmark)}
	</article>
{:else if bookmark.raw.type === 'url'}
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
		align-items: center;
		gap: var(--space-2);

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

			:has(.hint) &-title {
				translate: 0 0.5rem;
				transition: translate 200ms ease;
				will-change: translate;
			}

			&-subtext {
				font-size: 0.75rem;
				color: var(--color-on-surface-variant);

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

		&:hover,
		&.active {
			background-color: var(--color-surface-container);

			:global(.bookmark-info-title) {
				translate: 0 0;
				transition: translate 200ms ease 300ms;
				will-change: translate, opacity;
			}

			:global(.hint) {
				opacity: 1;
				translate: 0 0;
				transition:
					translate 200ms ease 300ms,
					opacity 200ms ease-in-out 300ms;
				will-change: translate, opacity;
			}
		}
	}
</style>
