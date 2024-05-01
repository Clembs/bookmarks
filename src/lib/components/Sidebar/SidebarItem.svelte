<script lang="ts">
	import type { ComponentType, Snippet } from 'svelte';

  let {
    active = false,
    href,
    oncontextmenu,
    onclick,
    icon,
    iconActive,
    children,
    class: className,
    ...mouseEvents
  }: {
    active?: boolean;
    href?: string;
    oncontextmenu?: (event: MouseEvent) => void;
    onclick?: (event: Event) => void;
    icon: ComponentType;
    iconActive?: ComponentType;
    children: Snippet;
    class?: string;
    ondragenter?: (event: DragEvent) => void;
    ondragover?: (event: DragEvent) => void;
    ondragleave?: (event: DragEvent) => void;
    ondrop?: (event: DragEvent) => void;
  } = $props();

  let iconProps = $derived({
    size: 20,
    weight: active ? 'fill' : 'regular'
  });

  let baseProps = $derived({
    class: `sidebar-item ${className}`,
    oncontextmenu,
    'data-active': active,
    ...mouseEvents
  });

</script>

<li>
  {#if href}
    <a {href} {...baseProps}>
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
    <button {onclick} {...baseProps}>
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
</li>

<style lang="scss">
  .sidebar-item {
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
    border: 2px solid transparent;

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