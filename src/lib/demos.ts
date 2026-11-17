// Maps a component page to the demo rendered in the gallery, so the docs can show the component
// live instead of only its source. Most families match by Pascal name; the rest share a demo with
// their layout or typography siblings.
import type { Component } from 'svelte';

const demos = import.meta.glob('../routes/demos/*.svelte', { eager: true }) as Record<
	string,
	{ default: Component<Record<string, never>> }
>;

const byName = new Map(
	Object.entries(demos).map(([file, module]) => [file.split('/').at(-1)!.replace(/\.svelte$/, ''), module.default])
);

const pascal = (slug: string) =>
	slug
		.split('-')
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join('');

/** Families whose demo lives with a sibling family's page. */
const SHARED: Record<string, string> = {
	'aspect-ratio': 'Layout',
	bleed: 'Layout',
	container: 'Layout',
	'simple-grid': 'Layout',
	stack: 'Layout',
	heading: 'Typography',
	text: 'Typography',
	textarea: 'Input'
};

export function demoFor(slug: string): Component<Record<string, never>> | undefined {
	return byName.get(pascal(slug)) ?? byName.get(SHARED[slug] ?? '');
}

export function hasOwnDemo(slug: string): boolean {
	return byName.has(pascal(slug));
}
