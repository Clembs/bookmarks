import { db } from '$lib/db';

export async function load({ parent, depends }) {
	const { session, categories } = await parent();

	const bookmarks = await db.query.bookmarks.findMany({
		where: ({ userId }, { eq }) => eq(userId, session.userId),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt)
	});

	depends('bookmarks');

	return {
		bookmarks,
		categories,
		session
	};
}
