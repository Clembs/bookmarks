<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { XCircle } from 'phosphor-svelte';
	import toast from 'svelte-french-toast';

	let errors = $state({
		email: '',
		displayName: '',
		password: '',
		confirmPassword: ''
	});
</script>

<h1>Welcome to saveit</h1>

<p>Very very very early alpha, i might delete your account and your saves. you've been warned.</p>

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
		label="Display name"
		type="text"
		name="display-name"
		required
		oninput={() => (errors.displayName = '')}
		error={errors.displayName}
	/>
	<TextInput
		label="Password"
		type="password"
		name="password"
		required
		oninput={() => (errors.password = '')}
		error={errors.password}
	/>
	<span id="pro-tip">
		Save it <a class="link" href="https://bitwarden.com">somewhere safe</a>!
	</span>

	<TextInput
		label="Confirm Password"
		type="password"
		name="confirm-password"
		required
		oninput={() => (errors.confirmPassword = '')}
		error={errors.confirmPassword}
	/>
	<Button type="submit">Create an account</Button>

	<div>
		Or <a class="link" href="/login">log into an existing account</a>
	</div>
</form>

<style>
	#pro-tip {
		margin-top: -0.5rem;
		font-size: 0.8rem;
	}
</style>
