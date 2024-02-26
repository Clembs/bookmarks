import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import entryShakingPlugin from 'vite-plugin-entry-shaking';

export default defineConfig({
	plugins: [
		sveltekit(),
		await entryShakingPlugin({
			targets: ['svelte-google-materialdesign-icons'],
			extensions: ['svelte']
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
