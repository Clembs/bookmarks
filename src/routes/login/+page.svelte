<script lang="ts">
	import { enhance } from '$app/forms';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<h1>Login</h1>

<form method="post" use:enhance class="flex col">
	<TextInput label="Email" type="email" name="email" required />
	<TextInput label="Password" type="password" name="password" required />
	<Button type="submit">Log in</Button>
</form>

<a href="/register">Register a new account</a>
