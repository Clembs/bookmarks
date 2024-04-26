<script lang="ts">
	let {
		href = '',
		style = 'filled',
		children,
		type = 'button',
		inline = false,
		icon = false,
		disabled = false,
		onclick,
		onsubmit
	}: {
		href?: string;
		style?: 'filled' | 'filled-tonal' | 'outline' | 'text';
		children?: any;
		type?: 'button' | 'submit';
		inline?: boolean;
		icon?: boolean;
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		onsubmit?: (event: Event) => void;
	} = $props();
</script>

{#if href && !disabled}
	<a {href} {onsubmit} {onclick} class={style} class:inline class:icon>
		{@render children()}
	</a>
{:else}
	<button {onsubmit} {onclick} {type} {disabled} class={style} class:inline class:icon>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	@import '../../styles/mixins.scss';

	a,
	button {
		padding: var(--space-3) var(--space-4);
		border-radius: var(--round-md);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		transition: background-color var(--transition-in-out-standard), transform var(--transition-in-out-standard), scale var(--transition-in-out-standard);
		user-select: none;
		width: 100%;

		&.inline {
			width: fit-content;
		}

		&:active {
			scale: 0.98;
		}

		&.filled {
			background-color: var(--color-primary);
			color: var(--color-on-primary);

			&:active {
				opacity: 0.9;
				box-shadow: none;
			}
		}

		&.text {
			// padding: 0 var(--space-3);
			background-color: transparent;
			color: var(--color-primary);

			&:hover, &:active, &:focus {
				background-color: var(--color-surface-container-highest);
			}
		}

		&:has(svg):not(.icon) {
			padding: var(--space-4);
		}

		&.icon {
			height: var(--space-10);
			width: var(--space-10);
			padding: 0;

			:global(svg) {
				width: 24px;
				height: 24px;
			}
		}

		&:disabled {
			pointer-events: none;
			background-color: var(--color-on-surface) / 0.12;
			color: var(--color-on-surface) / 0.36;
			// opacity: 0.12;
		}

		&:focus-visible {
			@include focus-visible(2px);
		}
	}
</style>
