import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	esbuild: {
		drop: ['console', 'debugger']
	}
};

export default config;
