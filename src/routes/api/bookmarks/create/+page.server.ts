import { error, fail } from '@sveltejs/kit';
import type { RawBookmarkInsert } from '$lib/types';
import { URL_REGEX, YOUTUBE_VIDEO_REGEX } from '$lib/validation';
import { createUrlBookmark, createYouTubeBookmark } from '$lib/helpers/create-bookmark';
import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import Color from 'color-string';

export const actions = {
	async default({ request, fetch, locals }) {
		const session = await locals.getSession();
		if (!session) return fail(401);

		const data = await request.formData();
		let raw = data.get('raw')?.toString();
		const categoryId = data.get('category-id')?.toString();

		if (categoryId) {
			const category = await db.query.categories.findFirst({
				where: ({ id, userId }, { eq, and }) => and(eq(id, categoryId), eq(userId, session.userId))
			});

			if (!category) {
				throw error(404, 'Folder not found');
			}
		}

		if (!raw) {
			return fail(400, {
				message: "Missing 'raw' field"
			});
		}

		let newBookmark: RawBookmarkInsert;

		if (YOUTUBE_VIDEO_REGEX.test(raw)) {
			newBookmark = await createYouTubeBookmark(raw, session.userId, fetch);
		} else if (URL_REGEX.test(raw)) {
			if (!raw.startsWith('http')) {
				raw = `https://${raw}`;
			}

			newBookmark = await createUrlBookmark(raw, session.userId, fetch);
		} else if (Color.get(raw)) {
			newBookmark = {
				title: raw,
				value: raw,
				type: 'color',
				userId: session.userId
			};
		} else {
			newBookmark = {
				title: raw,
				value: raw,
				type: 'text',
				userId: session.userId
			};
		}

		try {
			const [completeBookmark] = await db
				.insert(bookmarks)
				.values({ ...newBookmark, categoryId: categoryId || null })
				.returning();

			return {
				bookmark: completeBookmark
			};
		} catch (e) {
			throw error(500, String(e));
		}
	}
};
