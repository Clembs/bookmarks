<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance>
	<label for="email">
		Email
		<input type="email" name="email" required />
	</label>
	<label for="display-name">
		Display name
		<input type="text" name="display-name" required />
	</label>
	<label for="password">
		Password
		<input type="password" name="password" required />
	</label>
	<label for="confirm-password">
		Confirm Password
		<input type="password" name="confirm-password" required />
	</label>
	<button type="submit">Sign up</button>
</form>

<a href="/register">Log into an existing account</a>
