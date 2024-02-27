<script lang="ts">
	let {
		href = '',
		style = 'filled',
		children,
		type = 'button',
		inline = true,
		icon = false,
		disabled = false,
		onclick,
		onsubmit
	} = $props<{
		href?: string;
		style?: 'filled' | 'filled-tonal' | 'outline' | 'text';
		children?: any;
		type?: 'button' | 'submit';
		inline?: boolean;
		icon?: boolean;
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		onsubmit?: (event: Event) => void;
	}>();
</script>

{#if href && !disabled}
	<a {href} {onsubmit} {onclick} {type} class={style} class:inline class:icon>
		{@render children()}
	</a>
{:else}
	<button {onsubmit} {onclick} {type} {disabled} class={style} class:inline class:icon>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	button {
		padding: var(--space-2) var(--space-6);
		height: var(--space-10);
		border-radius: var(--round-full);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		transition: box-shadow 0.2s ease;
		user-select: none;

		&.inline {
			width: fit-content;
		}

		&.filled {
			background-color: var(--color-primary);
			color: var(--color-on-primary);

			&:hover {
				box-shadow: var(--elevation-1);
			}

			&:active {
				opacity: 0.9;
				box-shadow: none;
			}
		}

		&.text {
			padding: 0 var(--space-3);
			background-color: transparent;
			color: var(--color-primary);

			&:hover {
				background-color: var(--color-surface-container-highest);
			}
		}

		&:has(svg):not(.icon) {
			padding: var(--space-4);
		}

		&.icon {
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
	}
</style>
