import type { RequestEvent } from '@sveltejs/kit';
import { load } from 'cheerio';
import { decode } from 'html-entities';
import { fetchWithRedirections } from './fetchWithRedirections';

export async function fetchWebsiteInfo(url: string, fetch: RequestEvent['fetch']) {
	const site = await fetchWithRedirections(fetch, url, {
		headers: {
			'User-Agent': 'BookmarksBot/1.0 (+https://clembs.com)'
		}
	});

	if (!site.ok) {
		return {
			iconUrl: '',
			title: `Failed to fetch ${url}`
		};
	}

	const html = await site.text();
	const cheerio = load(html);

	const siteTitle = cheerio('title').text();

	let iconUrl =
		cheerio('link[rel="shortcut icon"]').attr('href') || cheerio('link[rel="icon"]').attr('href');

	// if it's a relative path, convert it to absolute
	if (iconUrl && !iconUrl.startsWith('http')) {
		iconUrl = new URL(iconUrl, url).toString();
	}

	// if it's an .ico, convert it to base64
	if (iconUrl && iconUrl.endsWith('.ico')) {
		try {
			const iconReq = await fetch(iconUrl);
			if (iconReq.ok) {
				const iconBuffer = await iconReq.arrayBuffer();
				iconUrl = `data:image/x-icon;base64,${Buffer.from(iconBuffer).toString('base64')}`;
			}
		} catch (e) {
			console.error('Failed to fetch icon', e);
			iconUrl = undefined;
		}
	}

	return {
		iconUrl,
		title: siteTitle ? decode(siteTitle) : url
	};
}
