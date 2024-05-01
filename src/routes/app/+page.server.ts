import { db } from '$lib/db';

export async function load({ parent, depends, setHeaders }) {
	const { session, categories } = await parent();

	const bookmarks = await db.query.bookmarks.findMany({
		where: ({ userId, categoryId }, { eq, isNull, and }) =>
			and(eq(userId, session.userId), isNull(categoryId)),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt)
	});

	depends('bookmarks:all');

	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	return {
		bookmarks,
		categories,
		session
	};
}
