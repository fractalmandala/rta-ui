import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import AvatarBasic from './harness/AvatarBasic.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement;

describe('Avatar', () => {
	test('renders the ark contract', () => {
		render(AvatarBasic, { props: { size: 'lg' } });

		const root = $('[data-scope="avatar"][data-part="root"]');
		expect(root.tagName).toBe('DIV');
		expect(root.getAttribute('data-size')).toBe('lg');
		expect(root.getAttribute('data-slot')).toBe('avatar-root');

		const image = $('[data-part="image"]') as HTMLImageElement;
		expect(image.getAttribute('data-state')).toBe('hidden');
		expect(image.hasAttribute('hidden')).toBe(true);
		expect(image.getAttribute('src')).toBe('https://example.com/a.png');

		const fallback = $('[data-part="fallback"]');
		expect(fallback.getAttribute('data-state')).toBe('visible');
		expect(fallback.hasAttribute('hidden')).toBe(false);
		expect(fallback.id).toBe(`${root.id}:fallback`);
		expect(image.id).toBe(`${root.id}:image`);
	});

	test('loading the image reveals it and hides the fallback', async () => {
		render(AvatarBasic);

		const image = $('[data-part="image"]');
		await fireEvent.load(image);

		expect(image.getAttribute('data-state')).toBe('visible');
		expect(image.hasAttribute('hidden')).toBe(false);
		expect($('[data-part="fallback"]').getAttribute('data-state')).toBe('hidden');
		expect($('[data-part="fallback"]').hasAttribute('hidden')).toBe(true);
	});

	test('image error keeps the fallback visible', async () => {
		render(AvatarBasic);

		await fireEvent.error($('[data-part="image"]'));
		expect($('[data-part="image"]').getAttribute('data-state')).toBe('hidden');
		expect($('[data-part="fallback"]').getAttribute('data-state')).toBe('visible');
	});
});
