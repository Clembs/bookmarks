<script lang="ts">
	let {
		href = '',
		style = 'primary',
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
		border-radius: var(--radii-round);
		display: inline-flex;
		gap: var(--space-1);
		transition: box-shadow 0.2s ease;

		&.inline {
			width: fit-content;
		}

		&.icon {
			padding-left: var(--space-4);
			padding: var(--space-4);
		}

		&.primary {
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

		&:disabled {
			pointer-events: none;
			background-color: var(--color-outline);
		}
	}
</style>
