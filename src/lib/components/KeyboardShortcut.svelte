<script lang="ts">
	let { shortcut } = $props<{
		shortcut: string;
	}>();

	$effect(() => {
		// dynamically use Command instead of Control
		if (navigator.userAgent.toLowerCase().includes('mac')) {
			shortcut.replace('Ctrl+', '⌘');
		}
	});
</script>

<kbd>
	{shortcut}
</kbd>

<style lang="scss">
	kbd {
		font-family: var(--fonts-body);
		font-size: 0.9rem;
		color: var(--color-on-surface-variant);
	}
</style>
