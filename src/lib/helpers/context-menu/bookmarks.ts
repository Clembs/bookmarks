import { urlTypeBookmarks, type Bookmark } from '$lib/helpers/bookmark.svelte';
import { ArrowSquareOut, Copy, PencilSimple, TrashSimple } from 'phosphor-svelte';

export function getBookmarkContextMenuItems(bookmark: Bookmark) {
	const items = [];

	if (bookmark.raw.value && urlTypeBookmarks.includes(bookmark.raw.type)) {
		items.push({
			label: 'Open URL',
			action: bookmark.raw.value!,
			icon: ArrowSquareOut,
			shortcut: 'Enter'
		});
	}

	if (bookmark.raw.type === 'youtube' && bookmark.raw.metadata) {
		items.push({
			label: 'Open Channel',
			action: bookmark.raw.metadata.authorUrl,
			icon: ArrowSquareOut
		});
	}

	if (bookmark.raw.value) {
		items.push({
			label: urlTypeBookmarks.includes(bookmark.raw.type) ? 'Copy URL' : 'Copy as text',
			action: () => navigator.clipboard.writeText(bookmark.raw.value!),
			icon: Copy,
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
			icon: PencilSimple,
			shortcut: 'F2'
		},
		{
			label: 'Delete',
			action: () => bookmark.delete(),
			icon: TrashSimple,
			shortcut: 'Del'
		}
	];
}
