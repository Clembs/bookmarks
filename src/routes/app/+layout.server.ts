import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession }, request }) {
	const session = await getSession();
	if (!session) throw redirect(302, '/login');

	const categories = await db.query.categories.findMany({
		where: ({ userId }, { eq }) => eq(userId, session.userId)
	});

	const isMobile = request.headers.get('user-agent')?.includes('Mobile');

	return {
		categories,
		isMobile,
		session
	};
}
