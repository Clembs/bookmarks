import { db } from '$lib/db';
import { error } from '@sveltejs/kit';

export async function load({ parent, params, depends, setHeaders }) {
	const { session, categories } = await parent();

	const category = categories.find((c) => c.id === params.categoryId);

	if (!category) {
		throw error(404, 'Folder not found');
	}

	const bookmarks = await db.query.bookmarks.findMany({
		where: ({ userId, categoryId }, { eq, and }) =>
			and(eq(userId, session.userId), eq(categoryId, params.categoryId)),
		orderBy: ({ createdAt }, { desc }) => desc(createdAt)
	});

	depends(`bookmarks:${category.id}`);

	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	return {
		bookmarks,
		category,
		categories,
		session
	};
}
