import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import { createUrlBookmark } from '$lib/helpers/create-bookmark';
import type { RawBookmark } from '$lib/types';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function PATCH({ params, locals, fetch }) {
	const session = await locals.getSession();
	if (!session) throw error(401);

	const bookmark = (await db.query.bookmarks.findFirst({
		where: ({ userId, id }, { eq, and }) => and(eq(userId, session.userId), eq(id, params.id))
	})) as RawBookmark<undefined>;

	if (!bookmark) throw error(404);

	const newData = await createUrlBookmark(bookmark.value, session.userId, fetch);

	const [newBookmark] = await db
		.update(bookmarks)
		.set({
			...bookmark,
			...newData,
			title: newData.title.trim(),
			updatedAt: new Date()
		})
		.where(eq(bookmarks.id, bookmark.id))
		.returning();

	return json(newBookmark);
}
