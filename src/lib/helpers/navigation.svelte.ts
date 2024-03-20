export type NavigationState = 'mouse' | 'keyboard';

export function createNavigation() {
	let navigationState = $state<NavigationState>('mouse');

	return {
		setState(state: NavigationState) {
			navigationState = state;
		},
		get state() {
			return navigationState;
		}
	};
}
