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

	let iconUrl =
		cheerio('link[rel="shortcut icon"]').attr('href') || cheerio('link[rel="icon"]').attr('href');

	if (iconUrl && !iconUrl.startsWith('http')) {
		iconUrl = new URL(iconUrl, url).toString();
	}

	const siteTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];

	return {
		iconUrl,
		title: siteTitle ? decode(siteTitle) : url
	};
}
