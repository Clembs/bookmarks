<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
</script>

<h1>Welcome to Bookmarks</h1>

<p>
	very very very early alpha, i might delete your account and your bookmarks. you've been warned.
</p>

<form method="post" use:enhance>
	<TextInput label="Email" type="email" name="email" required />
	<TextInput label="Display name" type="text" name="display-name" required />
	<TextInput label="Password" type="password" name="password" required />
	<TextInput label="Confirm Password" type="password" name="confirm-password" required />

	<div class="buttons">
		<Button style="text" type="button" href="/login">Log into an existing account</Button>
		<Button type="submit">Create an account</Button>
	</div>
</form>
