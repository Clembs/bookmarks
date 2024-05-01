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

		const errors = {
			email: '',
			password: '',
			confirmPassword: '',
			displayName: ''
		};

		if (!formEmail) errors.email = 'Email is required';

		if (!formPwd) errors.password = 'Password is required';

		if (!displayName) errors.displayName = 'Display name is required';

		if (!formEmail || !formPwd || !displayName) {
			return fail(400, errors);
		}

		if (formPwd.length < 8 || formPwd.length > 64)
			errors.password = 'Password must be between 8 and 64 characters long';

		if (
			!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[<>@$!.,"'/\\-_+=()€¥%*#?&])[A-Za-z\d<>@$!.,"'/\\-_+=()€¥%*#?&]{8,64}$/.test(
				formPwd
			)
		) {
			if (errors.password) {
				errors.password +=
					' and must contain at least one letter, one number, and one special character';
			} else {
				errors.password =
					'Password must contain at least one letter, one number, and one special character';
			}
		}

		if (formPwd !== formConfirmPwd) errors.confirmPassword = 'Passwords do not match';

		if (Object.values(errors).some(Boolean)) {
			return fail(400, errors);
		}

		const userData = await db.query.users.findFirst({
			where: ({ email }, { eq }) => eq(email, formEmail)
		});

		if (userData)
			return fail(400, {
				email: 'User already exists'
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
