import { byGroup, pages } from '#lib/docs.js';

export const prerender = true;

export function load() {
	return {
		groups: byGroup,
		count: pages.length
	};
}
