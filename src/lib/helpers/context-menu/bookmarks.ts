import { urlTypeBookmarks, type Bookmark } from '$lib/helpers/bookmark.svelte';
import { Delete, Edit, Open_in_new, Content_copy } from 'svelte-google-materialdesign-icons';

export function getBookmarkContextMenuItems(bookmark: Bookmark) {
	const items = [];

	if (bookmark.raw.value && urlTypeBookmarks.includes(bookmark.raw.type)) {
		items.push({
			label: 'Open URL',
			action: bookmark.raw.value!,
			icon: Open_in_new,
			shortcut: 'Enter'
		});
	}

	if (bookmark.raw.type === 'youtube' && bookmark.raw.metadata) {
		items.push({
			label: 'Open Channel',
			action: bookmark.raw.metadata.authorUrl,
			icon: Open_in_new
		});
	}

	if (bookmark.raw.value) {
		items.push({
			label: urlTypeBookmarks.includes(bookmark.raw.type) ? 'Copy URL' : 'Copy as text',
			action: () => navigator.clipboard.writeText(bookmark.raw.value!),
			icon: Content_copy,
			shortcut: 'Ctrl+C'
		});
	}

	return [
		...items,
		{
			label: 'Rename',
			action() {
				bookmark.setRenaming(true);
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
