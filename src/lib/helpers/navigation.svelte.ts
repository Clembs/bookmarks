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

export const inputType = createInputState();
