import bcrypt from 'bcryptjs';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { sessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (session) throw redirect(302, '/app');

	return {};
};

export const actions = {
	async default({ request, cookies }) {
		const data = await request.formData();
		const formEmail = data.get('email')?.toString();
		const formPwd = data.get('password')?.toString();

		const errors = {
			email: '',
			password: ''
		};

		if (!formEmail) errors.email = 'Email is required';

		if (!formPwd) errors.password = 'Password is required';

		if (!formEmail || !formPwd) return fail(400, errors);

		const userData = await db.query.users.findFirst({
			where: ({ email }, { eq }) => eq(email, formEmail)
		});

		if (!userData)
			return fail(400, {
				email: 'Invalid email or password'
			});

		const isCorrect = await bcrypt.compare(formPwd, userData.password);

		if (!isCorrect)
			return fail(400, {
				email: 'Invalid email or password'
			});

		const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

		const [session] = await db
			.insert(sessions)
			.values({
				expiresAt: new Date(Date.now() + ONE_WEEK),
				userId: userData.id
			})
			.onConflictDoUpdate({
				set: {
					expiresAt: new Date(Date.now() + ONE_WEEK)
				},
				where: eq(sessions.userId, userData.id),
				target: [sessions.id]
			})
			.returning();

		cookies.set('session_id', session.id, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			priority: 'high',
			path: '/',
			maxAge: ONE_WEEK
		});

		return redirect(302, '/app');
	}
};
