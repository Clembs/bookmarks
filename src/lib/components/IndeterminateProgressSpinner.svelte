<!-- 
  Remixed from n3r4zzurr0's svg-spinners (MIT License)
  https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/90-ring.svg?short_path=74838c2
  and Fran Pérez's Material Design Spinner (MIT License)
  https://codepen.io/mrrocks/pen/ExLovj
-->

<svg
	class="loading-spinner"
	width="24"
	height="24"
	viewBox="0 0 26 26"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
		id="spinner"
		fill="currentColor"
	/>
</svg>

<style lang="scss">
	.loading-spinner {
		--animation-duration: 1.4s;
		--offset: 63;
		color: var(--color-primary);
		animation: spin var(--animation-duration) linear infinite;

		#spinner {
			transform-origin: center;
			stroke-dasharray: var(--offset);
			stroke-dashoffset: 0;
			animation: dash var(--animation-duration) ease-in-out infinite;
		}
		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(270deg);
			}
		}

		@keyframes dash {
			0% {
				stroke-dashoffset: var(--offset);
			}
			50% {
				stroke-dashoffset: calc(var(--offset) / 4);
				transform: rotate(135deg);
			}
			100% {
				stroke-dashoffset: var(--offset);
				transform: rotate(450deg);
			}
		}
	}
</style>
