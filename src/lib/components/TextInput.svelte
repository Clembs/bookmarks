<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

	let {
		el = $bindable(),
		type = 'text',
		required = true,
		placeholder = '',
		disabled = false,
		readonly = false,
		value = $bindable(''),
		maxlength,
		minlength,
		multiline = false,
		name = '',
		label = '',
		height = '200px',
		autofocus = false,
		error = '',
		...restProps
	}: {
		el?: HTMLInputElement | HTMLTextAreaElement;
		type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
		required?: boolean;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		value?: string;
		maxlength?: number;
		minlength?: number;
		multiline?: boolean;
		name?: string;
		label?: string;
		height?: string;
		autofocus?: boolean;
		error?: string;
	} & HTMLInputAttributes &
		HTMLTextareaAttributes = $props();
</script>

<label for={name}>
	<span class="label">
		{label}
	</span>
	{#if multiline}
		<!-- on:input
	on:focus
	on:blur
	on:keydown -->
		<textarea
			style:--height={height}
			bind:this={el}
			bind:value
			{minlength}
			{maxlength}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{name}
			{autofocus}
			id={name}
			{...restProps}
		></textarea>
	{:else}
		<input
			{...{ type }}
			bind:this={el}
			bind:value
			{minlength}
			{maxlength}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{name}
			{autofocus}
			id={name}
			{...restProps}
		/>
	{/if}
	{#if error}
		<span class="text-input-error">{error}</span>
	{/if}
</label>

<style lang="scss">
	label {
		text-align: left;
		display: flex;
		flex-direction: column;

		.label {
			color: var(--color-on-surface-variant);
			margin-bottom: var(--space-2);
		}

		input,
		textarea {
			// height: 56px;
			width: 100%;
			padding: var(--space-3);
			font-size: 1rem;
			border-radius: var(--round-md);
			border: none;
			outline: 2px solid var(--color-on-surface-variant);
			background-color: inherit;
			color: var(--color-on-surface);
			font-family: var(--fonts-body);

			&:focus {
				outline: 2px solid var(--color-primary);
			}
		}

		textarea {
			resize: none;
			height: var(--height);
		}

		.text-input-error {
			color: var(--color-error);
			font-size: 0.75rem;
			margin-top: 0.25rem;
		}
	}
</style>
