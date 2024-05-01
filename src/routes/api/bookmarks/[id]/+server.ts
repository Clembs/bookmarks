import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import type { RawBookmark } from '$lib/types';
import { copyTypeBookmarks } from '$lib/helpers/bookmark.svelte';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { string, object, optional, parse, nullable } from 'valibot';

export async function PATCH({ params, request, locals: { getSession } }) {
	const session = await getSession();
	if (!session) throw error(401);
	const body = await request.json();

	const BookmarkEditSchema = object({
		title: optional(string()),
		iconUrl: optional(string()),
		value: optional(string()),
		// TODO: regex the hell out of this
		categoryId: optional(nullable(string()))
	});

	const newData = parse(BookmarkEditSchema, body);

	const bookmark = (await db.query.bookmarks.findFirst({
		where: ({ userId, id }, { eq, and }) => and(eq(userId, session.userId), eq(id, params.id))
	})) as RawBookmark<undefined>;

	if (newData.title && copyTypeBookmarks.includes(bookmark.type)) {
		// we do that since copyables don't really have a value
		newData.value = newData.title;
	}

	if (!bookmark) throw error(404);

	await db
		.update(bookmarks)
		.set({
			...newData,
			title: newData.title?.trim(),
			updatedAt: new Date()
		})
		.where(eq(bookmarks.id, bookmark.id));

	return new Response(null, { status: 204 });
}

export async function DELETE({ params, locals: { getSession } }) {
	const session = await getSession();
	if (!session) throw error(401);

	const bookmark = await db.query.bookmarks.findFirst({
		where: ({ userId, id }, { eq, and }) => and(eq(userId, session.userId), eq(id, params.id))
	});

	if (!bookmark) throw error(404);

	await db.delete(bookmarks).where(eq(bookmarks.id, bookmark.id));

	return new Response(null, { status: 204 });
}
