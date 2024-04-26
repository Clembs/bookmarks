import { db } from '$lib/db';
import { bookmarks } from '$lib/db/schema';
import type { RawBookmark, RawBookmarkInsert } from '$lib/db/types';
import type { RequestEvent } from '@sveltejs/kit';
import { decode } from 'html-entities';
import { fetchWebsiteInfo } from './fetchWebsiteInfo';

export async function createUrlBookmark(
	fullUrl: string,
	userId: string,
	fetch: RequestEvent['fetch']
): Promise<RawBookmarkInsert> {
	const { title: siteTitle, iconUrl } = await fetchWebsiteInfo(fullUrl, fetch);

	return {
		iconUrl,
		title: siteTitle ? decode(siteTitle.trim()) : fullUrl,
		value: fullUrl,
		type: 'url',
		userId: userId
	};
}

export async function createYouTubeBookmark(
	videoId: string,
	userId: string,
	fetch: RequestEvent['fetch']
): Promise<RawBookmarkInsert> {
	const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

	const videoDetailsReq = await fetch(
		`https://www.youtube.com/oembed?url=${videoUrl}&format=json`,
		{
			headers: {
				'User-Agent': 'BookmarksBot/1.0 (+https://clembs.com)'
			}
		}
	);

	if (!videoDetailsReq.ok) {
		const [newBookmark] = await db
			.insert(bookmarks)
			.values({
				title: `Failed to fetch details for video ${videoId}`,
				value: videoUrl,
				type: 'url',
				userId
			})
			.returning();

		return newBookmark;
	}

	const videoDetails: {
		title: string;
		author_name: string;
		author_url: string;
	} = await videoDetailsReq.json();

	return {
		title: videoDetails.title.trim(),
		value: videoUrl,
		iconUrl: `https://www.youtube.com/s/desktop/fe730087/img/favicon_48x48.png`,
		type: 'youtube',
		userId,
		metadata: {
			videoId,
			authorName: videoDetails.author_name,
			authorUrl: videoDetails.author_url
		}
	};
}

export async function createTextBookmark(raw: string, userId: string): Promise<RawBookmarkInsert> {
	return {
		title: raw,
		value: raw,
		type: 'text',
		userId
	};
}
