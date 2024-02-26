import type { Bookmark } from '$lib/helpers/bookmark.svelte';
import { Delete, Edit, Open_in_new } from 'svelte-google-materialdesign-icons';

export function getBookmarkContextMenuItems(bookmark: Bookmark) {
	return [
		{
			label: 'Open',
			action: bookmark.raw.value!,
			icon: Open_in_new,
			shortcut: 'Enter'
		},
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
			action: () => bookmark.deleteBookmark(),
			icon: Delete,
			shortcut: 'Del'
		}
	];
}
