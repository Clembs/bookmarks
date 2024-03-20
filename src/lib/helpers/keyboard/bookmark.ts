import { urlTypeBookmarks, type Bookmark } from '../bookmark.svelte';
import type { ShortcutActions } from './handler';

export function getBookmarkKbdActions(bookmark: Bookmark): ShortcutActions {
	return [
		{
			meta: true,
			key: 'c',
			action: () => navigator.clipboard.writeText(bookmark.raw.value!)
		},
		{
			key: 'F2',
			action: () => bookmark.setRenaming(true)
		},
		{
			key: 'Delete',
			action: () => bookmark.delete()
		},
		{
			key: 'Enter',
			action: () => {
				if (urlTypeBookmarks.includes(bookmark.raw.type)) {
					window.open(bookmark.raw.value!, '_blank');
				} else {
					navigator.clipboard.writeText(bookmark.raw.value!);
				}
			}
		}
	];
}
