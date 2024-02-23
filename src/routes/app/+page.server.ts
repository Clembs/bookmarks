import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { decode } from 'html-entities';
import type { PageServerLoad } from './$types';
import type { BookmarkType } from '$lib/db/types';
import { URL_REGEX } from '$lib/validation';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) throw redirect(302, '/login');

	const bookmarks = await db.query.bookmarks.findMany({
		where: ({ userId }, { eq }) => eq(userId, session.userId)
	});

	return {
		bookmarks
	} as { bookmarks: BookmarkType[] };
};

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

		let newBookmark: BookmarkType | undefined;

		if (URL_REGEX.test(raw)) {
			if (!raw.startsWith('http')) {
				raw = `https://${raw}`;
			}

			const site = await fetch(raw, {
				headers: {
					'User-Agent': 'BookmarksBot/1.0 (+https://clembs.com)'
				}
			});

			if (!site.ok) {
				return fail(404);
			}

			const html = await site.text();

			// eslint-disable-next-line no-irregular-whitespace
			let iconUrl = html.match(
				/<link\s+(?:type="[^"]+"\s*)?(?:rel="(?:shortcut\s+)?icon"\s*)?(?:type="[^"]+"\s*)?href="([^"]+)"(?:type="[^"]+"\s*)?(?:\s*rel="(?:shortcuts+)?icon"\s*)?(?:type="[^"]+"\s*)?\s*\/?>/
			)?.[1];

			if (iconUrl && !iconUrl.startsWith('http')) {
				iconUrl = new URL(iconUrl, raw).toString();
			}

			const siteTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];

			newBookmark = (
				await db
					.insert(bookmarks)
					.values({
						iconUrl,
						title: siteTitle ? decode(siteTitle) : raw,
						value: raw,
						type: 'url',
						userId: session.userId
					})
					.returning()
			)[0];
		}

		return {
			bookmark: newBookmark
		};
	}
};
