export type ShortcutActions = Record<string, () => void>;

export function handleKeyboardShortcut(event: KeyboardEvent, shortcuts: ShortcutActions) {
	const shortcut = Object.keys(shortcuts).find((key) => key === event.key);
	if (shortcut) {
		event.preventDefault();
		shortcuts[shortcut]();
	}
}
