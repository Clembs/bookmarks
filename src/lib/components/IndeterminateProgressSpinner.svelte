<!-- 
  Remixed from Mobbin's loading spinners made in CSS https://mobbin.com
-->

<script lang="ts">
	let { size = 16 } = $props();
</script>

<svg height={size} width={size} class="loading-spinner" viewBox="0 0 24 24" stroke="currentColor">
	<circle
		id="spinner"
		cx="12"
		cy="12"
		r="10"
		fill="none"
		stroke-linecap="round"
		stroke-width="3.6"
	/>
</svg>

<style lang="scss">
	.loading-spinner {
		color: var(--color-primary);

		animation: spin 2s linear infinite;

		#spinner {
			animation: worm 1.4s ease-in-out infinite;
		}
	}

	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes worm {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -62;
		}
	}
</style>
