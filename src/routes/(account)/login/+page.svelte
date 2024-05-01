<script lang="ts">
	import { enhance } from '$app/forms';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { XCircle } from 'phosphor-svelte';
	import toast from 'svelte-french-toast';

	let errors = $state({
		email: '',
		displayName: '',
		password: '',
		confirmPassword: ''
	});
</script>

<h1>Login to saveit</h1>

<form
	method="post"
	use:enhance={() => async ({ result, update }) => {
	if (result.type === 'failure' && result.data) {
		errors = result.data as any;
	} 
	else if (result.type === 'error') {
		toast.error('An error occurred. Please try again later.', {
			icon: XCircle
		});
	} else if (result.type === 'redirect') {
		
	}

	await update();
}}
>
	<TextInput
		label="Email"
		type="email"
		name="email"
		required
		oninput={() => (errors.email = '')}
		error={errors.email}
	/>
	<TextInput
		label="Password"
		type="password"
		name="password"
		required
		oninput={() => (errors.password = '')}
		error={errors.password}
	/>
	<Button type="submit">Login</Button>
	<div>
		Or <a class="link" href="/register">make a new account</a>
	</div>
</form>
