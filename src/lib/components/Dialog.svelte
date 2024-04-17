<script lang="ts">
	import type { ComponentType } from 'svelte';
	import Button from './Button.svelte';

	let {
		el,
		showModal = $bindable(),
		icon,
		headline,
		supportingText,
		children,
		actions,
		onclose
	}: {
		el?: HTMLDialogElement;
		showModal?: boolean;
		icon?: ComponentType;
		headline?: string;
		supportingText?: any;
		children: any;
		actions?: {
			label: string;
			action: 'submit' | (() => void);
			type?: 'filled' | 'text';
		}[];
		onclose?: () => void;
	} = $props();

	function close() {
		el?.close();
		onclose?.();
		showModal = false;
	}

	$effect(() => {
		if (showModal && el) {
			el.showModal();
		} else if (!showModal) {
			close();
		}
	});
</script>

<dialog bind:this={el} class="dialog" onclose={close}>
	<div class="content">
		{#if icon}
			<div class="icon">
				<svelte:component this={icon} size={24} />
			</div>
		{/if}
		{#if headline}
			<h2>{headline}</h2>
		{/if}

		{#if supportingText}
			{@render supportingText()}
		{/if}


		{@render children()}
	</div>

	{#if actions}
		<div class="actions">
			{#each actions as action}
				{#if typeof action.action === 'string'}
					<Button style={action.type || 'text'} type="submit">
						{action.label}
					</Button>
				{:else}
					<Button
						style={action.type || 'text'}
						onclick={() => typeof action.action === 'function' && action?.action()}
					>
						{action.label}
					</Button>
				{/if}
			{/each}
		</div>
	{/if}
</dialog>

<style lang="scss">
	.dialog {
		padding: var(--space-4);

		min-width: 380px;
		max-width: 560px;

		border: none;

		border-radius: var(--round-xlg);
		background-color: var(--color-surface-container-high);
		color: var(--color-on-surface-variant);

		&:has(.icon) {
			text-align: center;
		}

		.content {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);

			.icon {
				color: var(--color-secondary);
			}

			h2 {
				color: var(--color-on-surface);
				margin: 0;
				margin-top: var(--space-2);
			}
		}

		.actions {
			display: flex;
			justify-content: flex-end;
			width: 100%;
			gap: var(--space-2);
			margin-top: var(--space-4);
		}

		&::backdrop {
			background: var(--neutral-0);
			opacity: 0.32;
		}
	}
</style>
