import { describe, expect, test } from 'vitest';

// Read the committed pages and barrels through Vite's glob import: no Node builtins, so this test
// adds no `@types/node` to a browser package's environment. Freshness is enforced by
// `pnpm docs:check`, which re-runs the generator and diffs its output.
const pages = import.meta.glob('../docs/components/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const barrels = import.meta.glob('../src/lib/components/*/index.ts', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const familyOf = (file: string) => file.split('/').at(-1)!.replace(/\.md$/, '');

const families = Object.keys(barrels)
	.map((file) => file.split('/').at(-2)!)
	.sort();

const documented = Object.keys(pages)
	.filter((file) => !file.endsWith('/README.md'))
	.map(familyOf)
	.sort();

describe('component documentation', () => {
	test('every component family has a page and every page has a component', () => {
		expect(documented).toEqual(families);
	});

	test('each page documents every part its barrel exports', () => {
		const missing: string[] = [];
		for (const [file, barrel] of Object.entries(barrels)) {
			const family = file.split('/').at(-2)!;
			const page = pages[`../docs/components/${family}.md`];
			if (!page) continue;
			for (const match of barrel.matchAll(/export \{ default as (\w+) \}/g)) {
				if (!page.includes(`\`${match[1]}\``)) missing.push(`${family}: ${match[1]}`);
			}
		}
		expect(missing).toEqual([]);
	});

	test('every page names its parity status, and component pages their styling hooks', () => {
		const incomplete = Object.entries(pages)
			.filter(([file]) => !file.endsWith('/README.md'))
			// `progress` is shared state with no markup, so it has exports instead of hooks.
			.filter(([, page]) => !page.includes('**Parity:**'))
			.map(([file]) => familyOf(file));
		expect(incomplete).toEqual([]);

		const missingHooks = Object.entries(pages)
			.filter(([file]) => !file.endsWith('/README.md'))
			.filter(([, page]) => !page.includes('## Styling hooks') && !page.includes('## Exports'))
			.map(([file]) => familyOf(file));
		expect(missingHooks).toEqual([]);
	});

	test('the removed chart family has no page or index entry', () => {
		expect(pages['../docs/components/chart.md']).toBeUndefined();
		expect(pages['../docs/components/README.md'] ?? '').not.toMatch(/\(\/chart\.md\)/);
	});
});
