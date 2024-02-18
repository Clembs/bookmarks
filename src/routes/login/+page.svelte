<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance>
	<label for="email">
		Email
		<input type="email" name="email" />
	</label>
	<label for="password">
		Password
		<input type="password" name="password" />
	</label>
	<button type="submit">Log in</button>
</form>

<a href="/register">Register a new account</a>
