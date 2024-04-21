<script lang="ts">
	import { enhance } from '$app/forms';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<form method="post" use:enhance>
	<h1>Login</h1>

	<!-- <div class="form"> -->
	<TextInput label="Email" type="email" name="email" required />
	<TextInput label="Password" type="password" name="password" required />
	<Button type="submit">Login</Button>
	<!-- </div> -->

	<div>
		Or <a class="link" href="/register">make a new account</a>
	</div>
</form>
