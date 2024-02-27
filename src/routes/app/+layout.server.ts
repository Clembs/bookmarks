import { db } from '$lib/db';
import type { RawBookmark } from '$lib/db/types';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession }, depends }) {
	const session = await getSession();
	if (!session) throw redirect(302, '/login');

	const [userData] = await db.query.users.findMany({
		where: ({ id }, { eq }) => eq(id, session.userId),
		with: {
			bookmarks: {
				orderBy: ({ createdAt }, { asc }) => asc(createdAt)
			},
			categories: true
		}
	});

	depends('bookmarks');

	return {
		bookmarks: userData.bookmarks as RawBookmark[],
		categories: userData.categories
	};
}
