import type { RawBookmark } from '$lib/types';

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

			return req.ok;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async delete() {
		try {
			const bmEl = document.querySelector(`[data-bookmark-id="${this.raw.id}"]`);
			bmEl?.remove();

			if (this.raw.id) {
				const req = await fetch(`/api/bookmarks/${this.raw.id}`, {
					method: 'DELETE'
				});

				return req.ok;
			}
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
