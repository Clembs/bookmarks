<script lang="ts">
	import { Folder, FolderOpen } from 'phosphor-svelte';
	import SidebarItem from './SidebarItem.svelte';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import type { RawCategory } from '$lib/types';

	let {
		category,
		oncontextmenu
	}: {
		category: RawCategory;
		oncontextmenu?: (event: MouseEvent) => void;
	} = $props();

	let isHovering = $state(false);

	function dragOver(ev: DragEvent) {
		ev.preventDefault();
	}

	function dragEnter(ev: DragEvent) {
		ev.preventDefault();
		if (!ev.dataTransfer) return;

		const [type, categoryId, bookmarkId] = ev.dataTransfer.getData('text/plain').split('/');
		if (!type || !bookmarkId || !bookmarkId) return;
		if (type !== 'bm') return;
		if (categoryId === category.id) return;

		isHovering = true;
	}

	function dragLeave(ev: DragEvent) {
		ev.preventDefault();
		isHovering = false;
	}

	async function drop(ev: DragEvent) {
		isHovering = false;
		ev.preventDefault();
		ev.stopPropagation();
		if (!ev.dataTransfer) return;

		const [type, categoryId, bookmarkId] = ev.dataTransfer.getData('text/plain').split('/');
		if (!type || !bookmarkId || !bookmarkId) return;
		if (type !== 'bm') return;
		if (categoryId === category.id) return;

		const bmElement = document.querySelector(`[data-bookmark-id="${bookmarkId}"]`);
		bmElement?.remove();

		await fetch(`/api/bookmarks/${bookmarkId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ categoryId: category.id })
		});

		await invalidate(`bookmarks:${categoryId}`);
	}
</script>

<SidebarItem
	class="category {isHovering ? 'hovering' : ''}"
	icon={Folder}
	iconActive={FolderOpen}
	active={$page.url.pathname === `/app/${category.id}`}
	href={`/app/${category.id}`}
	{oncontextmenu}
	ondragenter={dragEnter}
	ondragover={dragOver}
	ondragleave={dragLeave}
	ondrop={drop}
>
	<!-- ondragenter={dragEnter} -->
	{category.name}
</SidebarItem>

<style lang="scss">
	:global(.sidebar-item.category.hovering) {
		border: 2px solid var(--color-primary);
	}
</style>
