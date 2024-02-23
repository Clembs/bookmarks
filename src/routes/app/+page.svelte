<script lang="ts">
	import { enhance } from '$app/forms';
	import Bookmark from '$lib/components/Bookmark.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { BookmarkType } from '$lib/db/types';
	import type { PageServerData } from './$types';

	let value = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let textInput = $state<HTMLInputElement | HTMLTextAreaElement | undefined>();
	let form = $state<HTMLFormElement | undefined>();

	const { data } = $props<{ data: PageServerData }>();
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

<main>
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
			<Bookmark {bookmark} />
		{/each}
	</ul>
</main>

<style lang="scss">
</style>
