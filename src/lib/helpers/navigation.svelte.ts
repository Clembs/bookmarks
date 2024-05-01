import { browser } from '$app/environment';
import type { DialogOptions } from '$lib/components/Dialog.svelte';
import type { ContextMenuAction } from '$lib/types';
import type { Snippet } from 'svelte';

export type InputType = 'mouse' | 'keyboard';

function createInputState() {
	let state = $state<InputType>('mouse');

	return {
		set(newState: InputType) {
			state = newState;
		},
		get state() {
			return state;
		}
	};
}

function createScreenSizeState() {
	const state = $state<{ width: number; height: number }>({
		width: browser ? window.innerWidth : 0,
		height: browser ? window.innerHeight : 0
	});

	if (browser) {
		state.width = window.innerWidth;
		state.height = window.innerHeight;

		window.addEventListener('resize', () => {
			state.height = window.innerHeight;
			state.width = window.innerWidth;
		});
	}

	return {
		get width() {
			return state.width;
		},
		get height() {
			return state.height;
		}
	};
}

function createContextMenuState() {
	const state = $state<{
		state: 'open' | 'closed';
		x: number;
		y: number;
		actions: ContextMenuAction[];
	}>({
		state: 'closed',
		x: 0,
		y: 0,
		actions: []
	});

	return {
		get state() {
			return state;
		},
		open(ev: MouseEvent, actions: ContextMenuAction[]) {
			ev.preventDefault();

			const element = ev.target as HTMLElement;
			const rect = element.getBoundingClientRect();
			const selectMenuHeight = actions.length * 40 + 8;

			// check context menu collision with the bottom of the screen
			if (rect.top + selectMenuHeight > window.innerHeight) {
				state.y = window.innerHeight - selectMenuHeight - 16;
			} else {
				state.y = ev.clientY;
			}
			// TODO: fix whatever i did here
			// check context menu collision with the right of the screen, or the left
			// if (rect.left + selectMenuWidth > window.innerWidth) {
			// 	x = window.innerWidth - selectMenuWidth - 16;
			// } else if (rect.left < selectMenuWidth) {
			// 	x = 16;
			// } else {
			state.x = ev.clientX;
			// }
			state.state = 'open';
			state.actions = actions;
		},
		close() {
			state.state = 'closed';
		},
		toggle(x: number, y: number, actions: ContextMenuAction[]) {
			if (state.state === 'open') {
				state.state = 'closed';
			} else {
				state.state = 'open';
				state.x = x;
				state.y = y;
				state.actions = actions;
			}
		}
	};
}

function createDialogState() {
	let state = $state<DialogOptions>({
		showModal: false,
		children: null as unknown as Snippet
	});

	return {
		get state() {
			return state;
		},
		open(options: DialogOptions) {
			state = {
				showModal: true,
				...options
			};
		},
		close() {
			state.showModal = false;
		}
	};
}

export const inputType = createInputState();
export const screenSize = createScreenSizeState();
export const contextMenu = createContextMenuState();
export const dialog = createDialogState();

$inspect(dialog);
