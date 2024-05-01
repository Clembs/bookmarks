<script lang="ts">
	import { enhance } from '$app/forms';
	import type { RawBookmark } from '$lib/types';
	import { Bookmark } from '$lib/helpers/bookmark.svelte';
	import { Plus } from 'phosphor-svelte';

	let error = $state('');
	let textInput = $state<HTMLInputElement | undefined>();
	let form = $state<HTMLFormElement | undefined>();

	let {
		bookmarks = $bindable(),
		value = $bindable(''),
		categoryId
	}: {
		bookmarks: Bookmark[];
		value: string;
		categoryId?: string;
	} = $props();
</script>

<svelte:window
	onkeydown={(ev) => {
		const isNothingFocused = !document.activeElement?.matches('input, textarea');
		const isMetaPressed = ev.metaKey || ev.ctrlKey;
		// if it's a letter or number and nothing is focused, focus the text input
		if (!isMetaPressed && !ev.altKey && !ev.shiftKey && ev.key.length === 1 && isNothingFocused) {
			textInput?.focus();
		}
		if (isMetaPressed && ev.key === 'f') {
			ev.preventDefault();
			textInput?.focus();
		}
		if (isMetaPressed && ev.key === 'v' && textInput && form && isNothingFocused) {
			textInput.focus();
			form.requestSubmit();
		}
	}}
/>

<form
	id="add-bookmark"
	method="post"
	action="/api/bookmarks/create/?"
	bind:this={form}
	use:enhance={() => {
		let newBookmark = new Bookmark({
			title: value,
		  value,
		  partial: true,
		});
		
		value = '';

		bookmarks.unshift(newBookmark);

		return async ({ result, update }) => {
			if (result.type === 'failure' && typeof result.data?.message === 'string') {
				error = result.data.message;
			}

			if (result.type === "success" && result.data?.bookmark) {
        bookmarks[0] = (
					new Bookmark(
						result.data.bookmark as RawBookmark
					)
				);
			}
			return await update();
		};
	}}
>
	<div id="main-input-wrapper">
		<div id="main-input">
			<input
				bind:this={textInput}
				bind:value
				type="text"
				name="raw"
				placeholder="Search a save or add to your saves"
			/>
			<input type="hidden" name="category-id" value={categoryId || ''} />

			<button disabled={!value} type="submit">
				<Plus weight="bold" />
			</button>
		</div>
		<div id="input-hint" class:hidden={value.length < 2}>
			Searching saves. Press Enter or click + to add to saves.
		</div>
	</div>
</form>

<style lang="scss">
	@import '../../styles/vars.scss';

	form {
		#main-input-wrapper {
			position: relative;

			#input-hint {
				position: absolute;
				top: 100%;
				left: var(--space-4);
				width: 100%;
				font-size: 0.7rem;
				opacity: 1;
				filter: blur(0px);
				transition:
					transform var(--transition-in-out-standard),
					opacity var(--transition-in-out-standard);

				&.hidden {
					transform: translateY(-100%);
					opacity: 0.75;
					filter: blur(1px);
				}
			}
		}

		#main-input {
			position: relative;
			display: flex;
			border: 1px solid var(--color-outline);
			background-color: var(--color-surface);
			border-radius: var(--round-full);
			margin: var(--space-4) 0;
			height: calc(var(--space-10) + var(--space-4));
			overflow: hidden;
			z-index: 3;

			input {
				flex: 1;
				padding: var(--space-4);
				border: none;
				outline: none;
				border-radius: var(--round-full);
				background-color: transparent;
				font: inherit;
				color: var(--color-on-surface);
			}

			button {
				display: grid;
				place-items: center;
				position: absolute;
				top: 0;
				// transform: translateY(-50%);
				right: 0px;
				transition: right var(--transition-in-out-emphasized);

				width: var(--space-10);
				height: var(--space-10);
				border: none;
				background-color: var(--color-primary);
				color: var(--color-on-primary);
				border-radius: var(--round-full);
				margin: var(--space-2);

				&:disabled {
					right: -100%;
				}
			}
		}

		@media (max-width: $compact) {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 9;
			background-color: var(--color-surface-container-highest);
			padding: var(--space-2);
			border-radius: var(--round-xlg) var(--round-xlg) 0 0;

			#main-input {
				margin: 0;
			}
		}
	}
</style>
