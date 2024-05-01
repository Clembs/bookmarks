import type { ContextMenuAction, RawCategory } from '$lib/types';
import { CheckCircle, PencilSimple, TrashSimple, XCircle } from 'phosphor-svelte';
import toast from 'svelte-french-toast';
import { dialog } from '../navigation.svelte';
import { invalidate } from '$app/navigation';

export function getCategoryContextMenuItems(category: RawCategory): ContextMenuAction[] {
	return [
		{
			label: 'Rename',
			action() {
				null;
			},
			icon: PencilSimple
			// shortcut: 'F2'
		},
		{
			label: 'Delete',
			async action() {
				dialog.open({
					icon: TrashSimple,
					headline: `Delete "${category.name}"?`,
					formActionUrl: `/api/categories/${category.id}?/delete&current-cid=${location.pathname}`,
					formActionCb: async () => {
						return async ({ result, update }) => {
							if (result.type === 'redirect' || result.type === 'success') {
								await invalidate('categories');
								toast.success('Category deleted.', {
									icon: CheckCircle
								});
							} else {
								toast.error('Failed to delete category.', {
									icon: XCircle
								});
							}

							await update();
						};
					},
					actions: [
						{
							label: 'Cancel',
							action: 'close'
						},
						{
							label: 'Delete category',
							action: 'submit',
							type: 'filled'
						}
					]
				});
			},
			icon: TrashSimple
			// shortcut: 'Del'
		}
	];
}
