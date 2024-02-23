import { URL_REGEX } from '$lib/validation';

export function trimUrl(url: string) {
	return url.match(URL_REGEX)?.[1] || url;
}
