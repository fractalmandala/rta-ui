import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: { runes: true },
      adapter: adapter(),
      prerender: {
        // The gallery demos use placeholder anchors (`href="#analytics"`) inside the docs previews,
        // so an in-page link with no target is expected rather than a build error.
        handleMissingId: 'warn',
      },
    }),
    svelteTesting(),
  ],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
  },
});
