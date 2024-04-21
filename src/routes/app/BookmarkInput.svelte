<script lang="ts">
	import { enhance } from '$app/forms';
	import type { RawBookmark } from '$lib/db/types';
	import { Bookmarks } from '$lib/helpers/bookmark.svelte';
	import { Plus } from 'phosphor-svelte';

	let error = $state('');
	let textInput = $state<HTMLInputElement | undefined>();
	let form = $state<HTMLFormElement | undefined>();

	let {
		bookmarks,
		value = $bindable('')
	}: {
		bookmarks: Bookmarks;
		value: string;
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
		bookmarks.push({
		  title: value,
		  value,
		  partial: true,
		});

		return async ({ result, update }) => {
			bookmarks.pop();

			if (result.type === 'failure' && typeof result.data?.message === 'string') {
				error = result.data.message;
			}

			if (result.type === "success" && result.data?.bookmark) {
        bookmarks.push(
          result.data.bookmark as RawBookmark
				);
			}
			return await update();
		};
	}}
>
	<div class="main-input">
		<input
			bind:this={textInput}
			bind:value
			type="text"
			name="raw"
			placeholder="Search a save or add to your saves"
		/>
		<button disabled={!value} type="submit">
			<Plus />
		</button>
	</div>
</form>

<style lang="scss">
	@import '../../styles/vars.scss';

	form {
		.main-input {
			position: relative;
			display: flex;
			border: 1px solid var(--color-outline);
			background-color: var(--color-surface);
			border-radius: var(--round-full);
			margin: var(--space-4) 0;
			height: calc(var(--space-10) + var(--space-4));
			overflow: hidden;

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
				transition: right var(--transition-enter-screen-standard);

				width: var(--space-10);
				height: var(--space-10);
				border: none;
				background-color: var(--color-primary);
				color: var(--color-on-primary);
				border-radius: var(--round-full);
				margin: var(--space-2);

				&:disabled {
					background-color: var(--color-surface-dim);
					color: var(--color-on-surface-variant);
					right: -100%;
					transition: right var(--transition-exit-screen-standard);
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

			.main-input {
				margin: 0;
			}
		}
	}
</style>
