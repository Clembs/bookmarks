import { db } from '$lib/db';
import { categories } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	async delete({ params, locals: { getSession }, url }) {
		const session = await getSession();
		if (!session) throw error(401);

		const category = await db.query.categories.findFirst({
			where: ({ userId, id }, { eq, and }) => and(eq(userId, session.userId), eq(id, params.id))
		});

		if (!category) throw error(404);

		await db.delete(categories).where(eq(categories.id, category.id));

		const currentCategoryId = url.searchParams.get('current-cid');

		if (currentCategoryId === category.id) {
			return redirect(303, `/app`);
		}

		return { success: true };
	}
};
