import { urlTypeBookmarks, type Bookmark } from '$lib/helpers/bookmark.svelte';
import type { ContextMenuAction } from '$lib/types';
import { ArrowSquareOut, ArrowsClockwise, Copy, PencilSimple, TrashSimple } from 'phosphor-svelte';
import Color from 'color-string';

export function getBookmarkContextMenuItems(bookmark: Bookmark): ContextMenuAction[] {
	const items: ContextMenuAction[] = [];

	if (bookmark.raw.value && urlTypeBookmarks.includes(bookmark.raw.type)) {
		items.push(
			{
				label: 'Open URL',
				action: bookmark.raw.value!,
				icon: ArrowSquareOut,
				shortcut: 'Enter'
			},
			{
				label: 'Refresh Metadata',
				action: () => bookmark.refresh(),
				icon: ArrowsClockwise
			}
		);
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

	if (bookmark.raw.type === 'color') {
		const color = Color.get(bookmark.raw.value!)!;

		items.push(
			{
				label: 'Copy HEX',
				action: () => navigator.clipboard.writeText(Color.to.hex(color.value)),
				icon: Copy
			},
			{
				label: 'Copy RGB',
				action: () => navigator.clipboard.writeText(Color.to.rgb(color.value)),
				icon: Copy
			},
			{
				label: 'Copy HSL',
				action: () => navigator.clipboard.writeText(Color.to.hsl(color.value)),
				icon: Copy
			}
		);
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
