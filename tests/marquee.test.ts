import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import MarqueeBasic from './harness/MarqueeBasic.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement;

describe('Marquee', () => {
	test('renders the ark contract', () => {
		render(MarqueeBasic);

		const root = $('[data-scope="marquee"][data-part="root"]');
		expect(root.getAttribute('role')).toBe('region');
		expect(root.getAttribute('aria-roledescription')).toBe('marquee');
		expect(root.getAttribute('aria-live')).toBe('off');
		expect(root.getAttribute('aria-label')).toBe('Marquee content');
		expect(root.getAttribute('data-state')).toBe('idle');
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.getAttribute('data-paused')).toBeNull();
		expect(root.getAttribute('style')).toContain('--marquee-translate: -100%');
		expect(root.getAttribute('style')).toContain('--marquee-loop-count: infinite');

		const viewport = $('[data-part="viewport"]');
		expect(viewport.getAttribute('data-side')).toBe('start');

		const contents = Array.from(
			document.querySelectorAll('[data-part="content"]')
		) as HTMLElement[];
		expect(contents).toHaveLength(2);
		expect(contents[0].getAttribute('data-index')).toBe('0');
		expect(contents[0].hasAttribute('data-clone')).toBe(false);
		expect(contents[0].getAttribute('aria-hidden')).toBeNull();
		expect(contents[1].getAttribute('data-clone')).toBe('');
		expect(contents[1].getAttribute('aria-hidden')).toBe('true');
		expect(contents[1].getAttribute('role')).toBe('presentation');
	});

	test('vertically oriented marquees translate on the y axis', () => {
		render(MarqueeBasic, { props: { side: 'top' } });

		const root = $('[data-part="root"]');
		expect(root.getAttribute('data-orientation')).toBe('vertical');
		expect(root.getAttribute('style')).toContain('--marquee-translate: -100%');
		expect($('[data-part="viewport"]').getAttribute('data-orientation')).toBe('vertical');
	});

	test('paused marquees report their state', () => {
		render(MarqueeBasic, { props: { paused: true } });

		const root = $('[data-part="root"]');
		expect(root.getAttribute('data-state')).toBe('paused');
		expect(root.getAttribute('data-paused')).toBe('');
		expect(document.querySelector('[data-part="content"]')!.getAttribute('style')).toContain(
			'will-change: auto'
		);
	});

	test('pauseOnInteraction pauses on hover', async () => {
		render(MarqueeBasic, { props: { pauseOnInteraction: true } });

		await fireEvent.mouseEnter($('[data-part="root"]'));
		expect($('[data-part="root"]').getAttribute('data-state')).toBe('paused');
		await fireEvent.mouseLeave($('[data-part="root"]'));
		expect($('[data-part="root"]').getAttribute('data-state')).toBe('idle');
	});
});
