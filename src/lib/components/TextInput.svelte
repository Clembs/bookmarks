<script lang="ts">
	let {
		el,
		type = 'text',
		required = true,
		placeholder = '',
		disabled = false,
		readonly = false,
		value = '',
		maxlength,
		minlength,
		multiline = false,
		name = '',
		label = '',
		height = '200px',
		error = '',
		...everythingElse
	} = $props<{
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
		error?: string;
	}>();
</script>

<div class="text-input">
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
			id={name}
			{...everythingElse}
		/>
	{/if}
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	{#if error}
		<span class="text-input-error">{error}</span>
	{/if}
</div>

<style lang="scss">
	.text-input {
		text-align: left;
		position: relative;
		margin-bottom: 1rem;

		label {
			position: absolute;
			left: 1rem;
			top: 50%;
			transform: translateY(-50%);
			color: var(--color-on-surface-variant);
			background: var(--color-surface);
			padding: 0 0.25rem;
			transition: all 0.2s;
		}

		input,
		textarea {
			// height: 56px;
			width: 100%;
			padding: 1rem;
			font-size: 1rem;
			border-radius: var(--round-xsm);
			border: none;
			outline: 1px solid var(--color-outline);
			background: var(--color-surface);
			color: var(--color-on-surface);

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
