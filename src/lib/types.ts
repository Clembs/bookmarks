import { bookmarks, categories } from '$lib/db/schema';
import type { ComponentType } from 'svelte';

export type YouTubeMetadata = {
	videoId: string;
	authorName: string;
	authorUrl: string;
};

export type RawBookmark<TPartial = true | undefined> = TPartial extends undefined
	? typeof bookmarks.$inferSelect & {
			partial?: TPartial;
		}
	: Partial<typeof bookmarks.$inferSelect> & {
			partial: TPartial;
		};

export type RawCategory = typeof categories.$inferSelect & {
	bookmarks: RawBookmark[];
};

export type RawBookmarkInsert = typeof bookmarks.$inferInsert;

export type ContextMenuAction = {
	label: string;
	action: (() => void) | string | undefined;
	icon?: ComponentType;
	shortcut?: string;
};
