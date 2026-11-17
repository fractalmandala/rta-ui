import { error } from '@sveltejs/kit';
import { bySlug, neighbours, pages } from '#lib/docs.js';

export const prerender = true;

export function entries() {
	return pages.map((page) => ({ slug: page.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const page = bySlug.get(params.slug);
	if (!page) error(404, `No component page for “${params.slug}”`);
	return { page, ...neighbours(params.slug) };
}
