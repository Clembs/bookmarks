<script lang="ts" context="module">
	export type DialogOptions = {
		showModal?: boolean;
		icon?: ComponentType;
		headline?: string;
		supportingText?: Snippet;
		children: Snippet;
		formActionUrl?: string;
		formActionCb?: SubmitFunction,
		actions?: {
			label: string;
			action: (() => void | Promise<void>) | 'submit' | 'close';
			type?: 'filled' | 'text';
		}[];
	};
</script>

<script lang="ts">
	import type { ComponentType, Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let {
		el,
		showModal = $bindable(),
		icon,
		headline,
		supportingText,
		children,
		formActionUrl,
		formActionCb,
		actions,
		onclose
	}: {
		el?: HTMLDialogElement;
		onclose?: () => void;
	} & DialogOptions = $props();

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

{#snippet dialogContent()}
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
				{#if typeof action.action !== 'string'}	
					<Button
						style={action.type || 'text'}
						inline
						onclick={() => typeof action.action === 'function' && action?.action()}
					>
					{action.label}
					</Button>
				{:else if action.action === 'close'}
					<Button
						style={action.type || 'text'}
						inline
						onclick={close}
					>
						{action.label}
					</Button>
				{:else if action.action === 'submit'}
					<Button style={action.type || 'text'} inline type="submit">
						{action.label}
					</Button>
				{/if}
			{/each}
		</div>
	{/if}
{/snippet}

<dialog bind:this={el} class="dialog" onclose={close}>
	{#if formActionUrl}
		<form use:enhance={(data) => {
			formActionCb?.(data);
			close();
		}} method="post" action={formActionUrl}>
			{@render dialogContent()}
		</form>
	{:else}
		{@render dialogContent()}
	{/if}
</dialog>

<style lang="scss">
	.dialog {
		padding: var(--space-4);

		min-width: 380px;
		max-width: 560px;

		border: none;

		border-radius: var(--round-md);
		background-color: var(--color-surface-container-high);
		color: var(--color-on-surface-variant);

		&:has(.icon) {
			text-align: center;
		}


		&::backdrop {
			background: var(--neutral-0);
			opacity: 0.32;
		}
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
</style>
