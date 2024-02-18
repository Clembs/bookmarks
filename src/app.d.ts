import type { sessions, users } from '$lib/db/schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<
				| (typeof sessions.$inferSelect & {
						user: typeof users.$inferSelect;
				  })
				| null
				| undefined
			>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
