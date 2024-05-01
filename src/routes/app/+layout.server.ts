import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession }, request, depends }) {
	const session = await getSession();
	if (!session) throw redirect(302, '/login');

	const categories = await db.query.categories.findMany({
		where: ({ userId }, { eq }) => eq(userId, session.userId),
		orderBy: ({ createdAt }, { asc }) => asc(createdAt)
	});

	depends('categories');

	const isMobile = request.headers.get('user-agent')?.includes('Mobile');

	return {
		categories,
		isMobile,
		session
	};
}
