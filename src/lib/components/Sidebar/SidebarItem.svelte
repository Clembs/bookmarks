<script lang="ts">
	import type { ComponentType, Snippet } from 'svelte';

  let {
    active = false,
    href,
    oncontextmenu,
    onclick,
    icon,
    iconActive,
    children
  }: {
    active?: boolean;
    href?: string;
    oncontextmenu?: (event: MouseEvent) => void;
    onclick?: (event: Event) => void;
    icon: ComponentType,
    iconActive?: ComponentType,
    children: Snippet
  } = $props();

  let iconProps = $derived({
    size: 20,
    weight: active ? 'fill' : 'regular'
  });
</script>

{#if href}
  <a {href} {oncontextmenu} class="item" data-active={active}>
    {#if icon}
      {#if active && iconActive}
        <svelte:component this={iconActive} {...iconProps} />
      {:else}
        <svelte:component this={icon} {...iconProps} />
      {/if}
      {/if}
      {@render children()}
  </a>
  {:else}
    <button {onclick} {oncontextmenu} class="item" data-active={active}>
      {#if icon}
        {#if active && iconActive}
          <svelte:component this={iconActive} {...iconProps} />
        {:else}
          <svelte:component this={icon} {...iconProps} />
        {/if}
      {/if}
    {@render children()}
  </button>
{/if}

<style lang="scss">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    white-space: nowrap;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--round-md);
    color: var(--color-on-surface-variant);
    text-decoration: none;

    &:hover {
      background-color: var(--color-surface-container);
    }

    &[data-active='true'] {
      background-color: var(--color-surface-container-highest);
      color: var(--color-on-surface);
      font-weight: 500;
    }
  }
</style>