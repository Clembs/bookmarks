import type { Bookmark } from '$lib/helpers/bookmark.svelte';
import { Delete, Edit, Open_in_new } from 'svelte-google-materialdesign-icons';
import ContentCopy from 'svelte-google-materialdesign-icons/Content_copy.svelte';

export function getBookmarkContextMenuItems(bookmark: Bookmark) {
	const items = [];

	if (bookmark.raw.value && bookmark.raw.type === 'url') {
		items.push({
			label: 'Open',
			action: bookmark.raw.value!,
			icon: Open_in_new,
			shortcut: 'Enter'
		});
	}

	if (bookmark.raw.value) {
		items.push({
			label: 'Copy',
			action: () => navigator.clipboard.writeText(bookmark.raw.value!),
			icon: ContentCopy,
			shortcut: 'Ctrl+C'
		});
	}

	return [
		...items,
		{
			label: 'Rename',
			action() {
				console.log('Edit');
			},
			icon: Edit,
			shortcut: 'F2'
		},
		{
			label: 'Delete',
			action: () => bookmark.delete(),
			icon: Delete,
			shortcut: 'Del'
		}
	];
}
