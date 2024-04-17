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

			await invalidate('bookmarks').then(() => console.log(`updated ${this.raw.id}`));

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

			await invalidate('bookmarks').then(() => console.log(`deleted ${this.raw.id}`));

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

export class Bookmarks {
	private bookmarks: Bookmark[] = [];

	constructor(rawBookmarks: (RawBookmark | Bookmark)[]) {
		this.bookmarks = rawBookmarks.map((bm) => (bm instanceof Bookmark ? bm : new Bookmark(bm)));
	}

	get all() {
		return this.bookmarks;
	}

	get length() {
		return this.bookmarks.length;
	}

	push(newBookmark: RawBookmark) {
		this.bookmarks.push(new Bookmark(newBookmark));
		invalidate('bookmarks').then(() => console.log('pushed bookmark'));
	}

	remove(id: string) {
		this.bookmarks = this.bookmarks.filter((bm) => bm.raw.id !== id);
	}

	find(id: string | undefined) {
		return this.bookmarks.find((bm) => bm.raw.id === id);
	}

	findIndex(id: string | undefined) {
		return this.bookmarks.findIndex((bm) => bm.raw.id === id);
	}

	pop() {
		return this.bookmarks.pop();
	}

	at(index: number) {
		return this.bookmarks[index];
	}

	filter(fn: (bm: Bookmark) => boolean) {
		return new Bookmarks(this.bookmarks.filter(fn));
	}
}
