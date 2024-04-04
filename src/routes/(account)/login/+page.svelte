<script lang="ts">
	import { enhance } from '$app/forms';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<h1>Login to Bookmarks</h1>

<form method="post" use:enhance>
	<TextInput label="Email" type="email" name="email" required />
	<TextInput label="Password" type="password" name="password" required />
	<div class="buttons">
		<Button style="text" type="button" href="/register">Register a new account</Button>
		<Button type="submit">Log in</Button>
	</div>
</form>
