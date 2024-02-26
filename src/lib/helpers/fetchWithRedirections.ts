/**
 * Recursively fetches a URL and its redirections using a Fetch API compatible function
 * @param fetch A Fetch API compatible function
 * @param url A URL string
 * @param options A RequestInit object
 */
export async function fetchWithRedirections(
	fetch: typeof window.fetch,
	url: string,
	options?: RequestInit
): Promise<Response>;
/**
 * Recursively fetches a URL and its redirections using window.fetch
 * @param url A URL string
 * @param options A RequestInit object
 */
export async function fetchWithRedirections(url: string, options?: RequestInit): Promise<Response>;
export async function fetchWithRedirections(
	urlOrFetch: string | typeof window.fetch,
	urlOrOptions?: string | RequestInit,
	options?: RequestInit
): Promise<Response> {
	console.log(urlOrFetch);
	console.log(urlOrOptions);

	// this was a headache to code but the end result is worth it
	const fetchFn = typeof urlOrFetch === 'string' ? fetch : urlOrFetch;
	const url = typeof urlOrOptions === 'string' ? urlOrOptions : (urlOrFetch as string);
	options = typeof urlOrOptions === 'string' ? options : urlOrOptions;

	const response = await fetchFn(url, options);

	if (response.redirected) {
		return fetchWithRedirections(response.url, options);
	}

	return response;
}
