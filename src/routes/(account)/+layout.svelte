<script lang="ts">
	import { enhance } from '$app/forms';
	import './style.scss';

	let { children } = $props();
</script>

<div id="content">
	{@render children()}
</div>

<style lang="scss">
	#content {
		display: grid;
		place-items: center;
		// flex-direction: column;
		// align-items: center;
		max-width: 500px;
		margin: 0 auto;
		height: 100%;
		padding: var(--space-4);
	}
</style>
