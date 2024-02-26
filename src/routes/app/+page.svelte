<script lang="ts">
	import { enhance } from '$app/forms';
	import Bookmark from '$lib/components/Bookmark.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { BookmarkType } from '$lib/db/types';
	import { Delete, Edit, Open_in_new } from 'svelte-google-materialdesign-icons';

	let value = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let textInput = $state<HTMLInputElement | HTMLTextAreaElement | undefined>();
	let form = $state<HTMLFormElement | undefined>();

	let currentBookmark = $state<BookmarkType | undefined>();
	let contextMenuVisible = $state(false);
	let x = $state(0);
	let y = $state(0);

	function showContextMenu(ev: MouseEvent, bookmark: BookmarkType) {
		ev.preventDefault();
		x = ev.clientX;
		y = ev.clientY;
		contextMenuVisible = true;
		currentBookmark = bookmark;
	}

	const { data } = $props();
</script>

<svelte:window
	onkeydown={(ev) => {
		// if it's a letter or number, focus the input
		if (ev.key.length === 1) {
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
	}}
/>

{#if contextMenuVisible && currentBookmark}
	<ContextMenu
		bind:visible={contextMenuVisible}
		{x}
		{y}
		items={[
			{
				label: 'Open',
				action: currentBookmark.value!,
				icon: Open_in_new,
				shortcut: "Enter",
			},
			{
				label: 'Rename',
				action() {
					console.log('Edit');
				},
				icon: Edit,
				shortcut: "F2",
			},
			{
				label: 'Delete',
				action() {
					console.log('Delete');
				},
				icon: Delete,
				shortcut: "Del"
			}
		]}
		onclose={() => {
			currentBookmark = undefined;
		}}
	/>
{/if}

<h1>Bookmarks</h1>

<form
	method="post"
	bind:this={form}
	use:enhance={() => {
		isLoading = true;
		data.bookmarks.push({
			value,
			partial: true,
		});
		return async ({ result, update }) => {
			isLoading = false;
			if (result.type === "failure" && result.data?.message) {
				error = result.data.message as string;
			}
			
			if (result.type === "success" && result.data?.bookmark) {
				console.log(result.data);
				data.bookmarks.pop();
				data.bookmarks.push(result.data.bookmark as BookmarkType);
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

<ul>
	{#each data.bookmarks as bookmark}
		<Bookmark
			active={currentBookmark && currentBookmark.id === bookmark.id}
			{bookmark}
			oncontextmenu={(ev) => typeof bookmark !== 'string' && showContextMenu(ev, bookmark)}
		/>
	{/each}
</ul>

<style lang="scss">
	form {
		position: sticky;
		top: 0.5rem;
		left: 0;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
</style>
