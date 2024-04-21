<script lang="ts">
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
		max-width: 400px;
		margin: 0 auto;
		height: 100%;
		padding: var(--space-10) var(--space-4);
	}
</style>
