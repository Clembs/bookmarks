import { fail } from '@sveltejs/kit';
import type { RawBookmark } from '$lib/db/types';
import { URL_REGEX, YOUTUBE_VIDEO_REGEX } from '$lib/validation';
import {
	createTextBookmark,
	createUrlBookmark,
	createYouTubeBookmark
} from '$lib/helpers/create-bookmark';

export const actions = {
	async default({ request, fetch, locals }) {
		const session = await locals.getSession();
		if (!session) return fail(401);

		const data = await request.formData();
		let raw = data.get('raw')?.toString();

		if (!raw) {
			return fail(400, {
				message: "Missing 'raw' field"
			});
		}

		let newBookmark: RawBookmark | undefined;

		if (YOUTUBE_VIDEO_REGEX.test(raw)) {
			const videoId = raw.match(YOUTUBE_VIDEO_REGEX)![1];

			newBookmark = await createYouTubeBookmark(videoId, session.userId, fetch);
		} else if (URL_REGEX.test(raw)) {
			if (!raw.startsWith('http')) {
				raw = `https://${raw}`;
			}

			newBookmark = await createUrlBookmark(raw, session.userId, fetch);
		} else {
			console.log('Creating text bookmark');
			newBookmark = await createTextBookmark(raw, session.userId);
		}

		return {
			bookmark: newBookmark
		};
	}
};
