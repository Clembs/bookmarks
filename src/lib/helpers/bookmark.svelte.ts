import { invalidate } from '$app/navigation';
import type { RawBookmark } from '$lib/db/types';

export const urlTypeBookmarks: Partial<RawBookmark['type']>[] = ['url', 'youtube'];
export const copyTypeBookmarks: Partial<RawBookmark['type']>[] = ['text', 'color', 'contact'];

export class Bookmark {
	private bmIsLoading = $state(false);
	private bmIsRenaming = $state(false);

	constructor(public raw: RawBookmark) {}

	async rename(newTitle: string) {
		try {
			const req = await fetch(`/api/bookmarks/${this.raw.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: newTitle
				})
			});

			await invalidate('bookmarks').then(() => console.log('updated'));

			return req.ok;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async delete() {
		try {
			const req = await fetch(`/api/bookmarks/${this.raw.id}`, {
				method: 'DELETE'
			});

			await invalidate('bookmarks').then(() => console.log('updated'));

			return req.ok;
		} catch (error) {
			return false;
		}
	}

	get isRenaming() {
		return this.bmIsRenaming;
	}
	setRenaming = (newState: boolean) => (this.bmIsRenaming = newState);

	get isLoading() {
		return this.bmIsLoading;
	}
	setLoading = (newState: boolean) => (this.bmIsLoading = newState);
}
