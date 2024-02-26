import type { Bookmark } from '../bookmark.svelte';
import type { ShortcutActions } from './handler';

export function getBookmarkKbdActions(bookmark: Bookmark): ShortcutActions {
	return {
		F2: () => console.log('Rename'),
		Del: () => bookmark.delete(),
		Enter: () => console.log('Enter')
	};
}
