import type { RawBookmarkInsert } from '$lib/types';
import type { RequestEvent } from '@sveltejs/kit';
import { decode } from 'html-entities';
import { fetchWebsiteInfo } from './fetchWebsiteInfo';
import { YOUTUBE_VIDEO_REGEX } from '$lib/validation';

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
	rawContent: string,
	userId: string,
	fetch: RequestEvent['fetch']
): Promise<RawBookmarkInsert> {
	const videoId = rawContent.match(YOUTUBE_VIDEO_REGEX)![1];
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
		return {
			title: `Failed to fetch details for video ${videoId}`,
			value: rawContent,
			type: 'url',
			userId
		};
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
