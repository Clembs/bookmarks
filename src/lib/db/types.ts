import { bookmarks } from '$lib/db/schema';

export type BookmarkType = typeof bookmarks.$inferSelect | string;
