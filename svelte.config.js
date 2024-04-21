import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { phosphorSvelteOptimize } from 'phosphor-svelte/preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [phosphorSvelteOptimize(), vitePreprocess()],

	kit: {
		adapter: adapter()
		// csrf: {
		// 	checkOrigin: false
		// }
	}
};

export default config;
