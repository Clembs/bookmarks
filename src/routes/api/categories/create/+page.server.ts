import { db } from '$lib/db';
import { categories } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	async default({ request, locals: { getSession } }) {
		const session = await getSession();
		if (!session) throw redirect(301, '/login');

		const formData = await request.formData();
		const name = formData.get('name')?.toString();

		if (!name) {
			return fail(400, { message: 'Name is required' });
		}

		const [category] = await db
			.insert(categories)
			.values({
				name,
				userId: session.userId
			})
			.returning();

		throw redirect(303, `/app/${category.id}`);
	}
};
