import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession }, depends }) {
	const session = await getSession();
	if (!session) throw redirect(302, '/login');

	const [userData] = await db.query.users.findMany({
		where: ({ id }, { eq }) => eq(id, session.userId),
		with: {
			bookmarks: true,
			categories: true
		}
	});

	depends('bookmarks');

	return {
		bookmarks: userData.bookmarks,
		categories: userData.categories
	};
}
