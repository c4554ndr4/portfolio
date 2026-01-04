import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	base: '/portfolio/',
	build: {
		outDir: 'dist/game',
		emptyOutDir: false,
		lib: {
			entry: path.resolve('src/game/entry.ts'),
			formats: ['es'],
			fileName: () => 'game.js',
		},
		target: 'es2019',
	},
});
