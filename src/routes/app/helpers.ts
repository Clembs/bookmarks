import { urlTypeBookmarks, type Bookmark } from '$lib/helpers/bookmark.svelte';
import { Delete, Edit, Open_in_new } from 'svelte-google-materialdesign-icons';
import ContentCopy from 'svelte-google-materialdesign-icons/Content_copy.svelte';

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
			label: 'Copy as text',
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
