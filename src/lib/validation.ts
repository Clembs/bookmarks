export const URL_REGEX =
	/^(?:(?:https?|ftp):\/\/)?(?:www\.)?([a-zA-Z0-9\-.]+\.[a-zA-Z]{2,})(?:\/.*)?(?:\?.*)?(?:#.*)?$/;

// Regex courtesy of https://regex101.com/r/OY96XI/1
export const YOUTUBE_VIDEO_REGEX =
	/(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/i;
