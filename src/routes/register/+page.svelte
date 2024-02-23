<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
</script>

<form method="post" use:enhance>
	<TextInput label="Email" type="email" name="email" required />
	<TextInput label="Display name" type="text" name="display-name" required />
	<TextInput label="Password" type="password" name="password" required />
	<TextInput label="Confirm Password" type="password" name="confirm-password" required />
	<Button type="submit">Sign up</Button>
</form>

<a href="/login">Log into an existing account</a>
