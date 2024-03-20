export type ShortcutActions = {
	key: string;
	meta?: boolean;
	alt?: boolean;
	shift?: boolean;
	action: () => void;
}[];

export function handleKeyboardShortcut(event: KeyboardEvent, shortcuts: ShortcutActions) {
	const os = navigator.platform;
	const meta = os.includes('Mac') ? 'Meta' : 'Control';
	console.log(event.key);

	const shortcut = shortcuts.find((shortcut) => {
		const modifierKeys = [];
		if (shortcut.meta) modifierKeys.push(meta);
		if (shortcut.alt) modifierKeys.push('Alt');
		if (shortcut.shift) modifierKeys.push('Shift');

		return modifierKeys.every((key) => event.getModifierState(key)) && event.key === shortcut.key;
	});

	console.log(shortcut);

	if (shortcut) {
		event.preventDefault();
		shortcut.action();
	}
}
