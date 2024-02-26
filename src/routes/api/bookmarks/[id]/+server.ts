import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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
