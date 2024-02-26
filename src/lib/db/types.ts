import { bookmarks, categories } from '$lib/db/schema';

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
