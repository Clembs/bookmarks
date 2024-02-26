import { db } from '$lib/db';
import type { BookmarkType, CategoryType } from '$lib/db/types';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession } }) {
	const session = await getSession();
	if (!session) throw redirect(302, '/login');

	const [userData] = await db.query.users.findMany({
		where: ({ id }, { eq }) => eq(id, session.userId),
		with: {
			bookmarks: true,
			categories: true
		}
	});

	return {
		bookmarks: userData.bookmarks,
		categories: userData.categories
	} as {
		bookmarks: BookmarkType[];
		categories: CategoryType[];
	};
}
