import type { ContextMenuAction, RawCategory } from '$lib/types';
import { CheckCircle, PencilSimple, TrashSimple, XCircle } from 'phosphor-svelte';
import toast from 'svelte-french-toast';
import { dialog } from '../navigation.svelte';

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
					formActionUrl: `/api/categories/${category.id}?/delete`,
					formActionCb:
						() =>
						async ({ result, update }) => {
							if (result.type === 'success') {
								if (location.pathname.includes(category.id)) {
									location.href = '/app';
								}
								console.log('hello');

								toast.success('Category deleted.', {
									icon: CheckCircle
								});
							} else {
								toast.error('Failed to delete category.', {
									icon: XCircle
								});
							}
							await update();
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
