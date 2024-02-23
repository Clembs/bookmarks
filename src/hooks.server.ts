import { db } from '$lib/db';
import { sessions } from '$lib/db/schema';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	event.locals.getSession = async () => {
		if (!sessionId) return null;

		const session = await db.query.sessions.findFirst({
			where: ({ id }, { eq }) => eq(id, sessionId),
			with: {
				user: true
			}
		});

		if (!session) return null;
		if (Date.now() >= session.expiresAt.getTime()) return null;

		if (Date.now() - session.expiresAt.getTime() <= 10 * 60 * 60 * 1000) {
			return {
				...session,
				...(await db
					.update(sessions)
					.set({
						expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
					})
					.where(eq(sessions.id, session.id))
					.returning())
			};
		}

		return session;
	};

	return await resolve(event);
};
