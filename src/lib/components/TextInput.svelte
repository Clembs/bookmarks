<script lang="ts">
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
		...everythingElse
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
	} = $props();
</script>

<label for={name}>
	<span class="label">
		{label}
	</span>
	{#if multiline}
		<textarea
			style:--height={height}
			bind:this={el}
			bind:value
			on:input
			on:focus
			on:blur
			on:keydown
			{minlength}
			{maxlength}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{name}
			{autofocus}
			id={name}
			{...everythingElse}
		/>
	{:else}
		<input
			{...{ type }}
			bind:this={el}
			bind:value
			on:input
			on:focus
			on:blur
			on:keydown
			{minlength}
			{maxlength}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{name}
			{autofocus}
			id={name}
			{...everythingElse}
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
			outline: 2px solid var(--color-surface-container-highest);
			background-color: inherit;
			color: var(--color-on-surface);
			font-family: var(--fonts-body);

			&:focus {
				outline: 2px solid var(--color-primary);

				& + label {
					color: var(--color-primary);
				}
			}

			&:focus,
			&:not(:placeholder-shown) {
				& + label {
					top: 0;
					transform: translateY(-50%) translateX(-0.25rem);
					font-size: 0.75rem;
				}
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
