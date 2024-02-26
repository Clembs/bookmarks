import { db } from '$lib/db';
import { sessions, users } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (session) throw redirect(302, '/app');
};

export const actions = {
	async default({ cookies, request }) {
		const data = await request.formData();
		const formEmail = data.get('email')?.toString();
		const formPwd = data.get('password')?.toString();
		const formConfirmPwd = data.get('confirm-password')?.toString();
		const displayName = data.get('display-name')?.toString();

		if (!formEmail)
			return fail(400, {
				message: 'Email is required'
			});

		if (!formPwd)
			return fail(400, {
				message: 'Password is required'
			});

		if (!displayName)
			return fail(400, {
				message: 'Display name is required'
			});

		if (formPwd.length < 8 || formPwd.length > 64)
			return fail(400, {
				message: 'Password must be at least 8 characters and at most 64 characters'
			});

		if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/.test(formPwd))
			return fail(400, {
				message: 'Password must contain at least one letter, one number, and one special character'
			});

		if (formPwd !== formConfirmPwd)
			return fail(400, {
				message: 'Passwords do not match'
			});

		const userData = await db.query.users.findFirst({
			where: ({ email }, { eq }) => eq(email, formEmail)
		});

		if (userData)
			return fail(400, {
				message: 'User already exists'
			});

		const [user] = await db
			.insert(users)
			.values({
				displayName,
				email: formEmail,
				password: bcrypt.hashSync(formPwd)
			})
			.returning();

		const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

		const [session] = await db
			.insert(sessions)
			.values({
				expiresAt: new Date(Date.now() + ONE_WEEK),
				userId: user.id
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

		throw redirect(302, '/app');
	}
};
