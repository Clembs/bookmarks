import type { ContextMenuAction, RawCategory } from '$lib/types';
import { PencilSimple, TrashSimple } from 'phosphor-svelte';

export function getCategoryContextMenuItems(category: RawCategory): ContextMenuAction[] {
	return [
		{
			label: 'Rename',
			action() {
				null;
			},
			icon: PencilSimple,
			shortcut: 'F2'
		},
		{
			label: 'Delete',
			action() {
				null;
			},
			icon: TrashSimple,
			shortcut: 'Del'
		}
	];
}
