import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import type { RawBookmark } from '$lib/db/types';
import type { RequestEvent } from '@sveltejs/kit';
import { load } from 'cheerio';
import { decode } from 'html-entities';
import { fetchWithRedirections } from './fetchWithRedirections';

export async function createUrlBookmark(
	fullUrl: string,
	userId: string,
	fetch: RequestEvent['fetch']
): Promise<RawBookmark | undefined> {
	const site = await fetchWithRedirections(fetch, fullUrl, {
		headers: {
			'User-Agent': 'BookmarksBot/1.0 (+https://clembs.com)'
		}
	});

	if (!site.ok) {
		const [newBookmark] = await db
			.insert(bookmarks)
			.values({
				title: `Failed to fetch ${fullUrl}.`,
				value: fullUrl,
				type: 'url',
				userId
			})
			.returning();

		return newBookmark;
	}

	const html = await site.text();
	const cheerio = load(html);

	let iconUrl =
		cheerio('link[rel="shortcut icon"]').attr('href') || cheerio('link[rel="icon"]').attr('href');

	if (iconUrl && !iconUrl.startsWith('http')) {
		iconUrl = new URL(iconUrl, fullUrl).toString();
	}

	const siteTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];

	const [newBookmark] = await db
		.insert(bookmarks)
		.values({
			iconUrl,
			title: siteTitle ? decode(siteTitle) : fullUrl,
			value: fullUrl,
			type: 'url',
			userId: userId
		})
		.returning();
	return newBookmark;
}

export async function createTextBookmark(
	raw: string,
	userId: string
): Promise<RawBookmark | undefined> {
	const [newBookmark] = await db
		.insert(bookmarks)
		.values({
			title: raw,
			value: raw,
			type: 'text',
			userId
		})
		.returning();

	return newBookmark;
}
