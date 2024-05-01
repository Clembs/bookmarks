export function trimText(string: string, maxLength: number = 20) {
	return string.length > maxLength ? `${string.substring(0, maxLength)}...` : string;
}
