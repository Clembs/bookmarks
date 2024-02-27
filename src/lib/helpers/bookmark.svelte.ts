import { invalidate } from '$app/navigation';
import type { RawBookmark } from '$lib/db/types';
import type { FetchState } from './state';

export const urlTypeBookmarks: Partial<RawBookmark['type']>[] = ['url', 'youtube'];

export class Bookmark {
	private bmDeleteState = $state<FetchState>();
	// TODO: Implement edit state and global loading state
	private bmIsLoading = false;
	// private bmEditState = $state<FetchState>();

	constructor(public raw: RawBookmark) {}

	async delete() {
		this.bmDeleteState = 'loading';
		try {
			const req = await fetch(`/api/bookmarks/${this.raw.id}`, {
				method: 'DELETE'
			});

			await invalidate('bookmarks').then(() => console.log('updated'));

			this.bmDeleteState = req.ok ? 'success' : 'error';

			return req.ok;
		} catch (error) {
			this.bmDeleteState = 'error';
			return false;
		}
	}

	get deleteState() {
		return this.bmDeleteState;
	}

	get isLoading() {
		return this.bmIsLoading;
	}
}
