import { browser } from '$app/environment';

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

export const inputType = createInputState();
export const screenSize = createScreenSizeState();
