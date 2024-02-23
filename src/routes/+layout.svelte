<script lang="ts">
	import '../styles/global.scss';
	let { children } = $props();
</script>

<div id="content">
	{@render children()}
</div>

<style lang="scss">
	#content {
		display: flex;
		flex-direction: column;
		max-width: 768px;
		margin: 0 auto;
		padding: var(--space-4);
	}
</style>
