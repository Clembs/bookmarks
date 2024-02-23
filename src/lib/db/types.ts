import { bookmarks } from '$lib/db/schema';

export type BookmarkType<TPartial = true | undefined> = TPartial extends undefined
	? typeof bookmarks.$inferSelect & {
			partial?: TPartial;
		}
	: Partial<typeof bookmarks.$inferSelect> & {
			partial: TPartial;
		};
