<script lang="ts">
	let { onclose } = $props<{
		onclose: () => void;
	}>();
</script>

<div
	aria-hidden="true"
	onclick={onclose}
	onkeydown={(ev) => {
		console.log(ev.key);
		if (ev.key === 'Escape') {
			onclose();
		}
	}}
	class="scrim"
/>

<style lang="scss">
	.scrim {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--neutral-0);
		opacity: 0.32;
		z-index: 3;
	}
</style>
