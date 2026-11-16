import { render } from '@testing-library/svelte';
import { flushSync, tick } from 'svelte';
import { describe, expect, test } from 'vitest';
import ScrollAreaBasic from './harness/ScrollAreaBasic.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

function mockMetrics(node: HTMLElement, metrics: Record<string, number>) {
	for (const [key, value] of Object.entries(metrics)) {
		Object.defineProperty(node, key, { configurable: true, writable: true, value });
	}
}

function click(selector: string) {
	const node = $(selector)!;
	node.click();
	flushSync();
}

async function setup() {
	render(ScrollAreaBasic, { props: {} });

	const viewport = $('[data-part="viewport"]')!;
	mockMetrics(viewport, {
		scrollHeight: 1000,
		clientHeight: 200,
		scrollWidth: 300,
		clientWidth: 300
	});
	await tick();

	return { viewport, root: $('[data-part="root"]')! };
}

describe('ScrollArea', () => {
	test('renders the Ark contract', async () => {
		const { root, viewport } = await setup();

		expect(root.getAttribute('data-slot')).toBe('scroll-area-root-provider');
		expect(root.getAttribute('role')).toBe('presentation');
		expect(root.getAttribute('dir')).toBe('ltr');
		expect(root.id).toBe('scroll-area-harness');

		expect(viewport.getAttribute('data-ownedby')).toBe(root.id);
		expect(viewport.getAttribute('role')).toBe('presentation');
		expect(viewport.getAttribute('data-slot')).toBe('scroll-area-viewport');

		const content = $('[data-part="content"]')!;
		expect(content.getAttribute('data-slot')).toBe('scroll-area-content');
		expect(content.getAttribute('role')).toBe('presentation');

		const scrollbarY = $('[data-testid="scrollbar-y"]')!;
		expect(scrollbarY.getAttribute('data-orientation')).toBe('vertical');
		expect(scrollbarY.getAttribute('data-ownedby')).toBe(root.id);
		expect(scrollbarY.getAttribute('data-slot')).toBe('scroll-area-scrollbar');

		const thumbY = $('[data-testid="thumb-y"]')!;
		expect(thumbY.getAttribute('data-orientation')).toBe('vertical');
		expect(thumbY.getAttribute('data-slot')).toBe('scroll-area-thumb');
		expect(thumbY.style.height).toBe('var(--thumb-height)');

		expect($('[data-part="corner"]')!.getAttribute('data-slot')).toBe('scroll-area-corner');
	});

	test('merges consumer style with the generated style', async () => {
		const { root, viewport } = await setup();

		expect(viewport.getAttribute('style')).toContain('overflow: auto');
		expect(viewport.getAttribute('style')).toContain('height: 200px');
		expect(root.getAttribute('style')).toContain('position: relative');
	});

	test('measures overflow and exposes thumb variables', async () => {
		const { root, viewport } = await setup();
		expect(viewport.getAttribute('tabindex')).toBe('0');

		click('[data-testid="measure"]');

		expect(viewport.hasAttribute('data-overflow-y')).toBe(true);
		expect(viewport.hasAttribute('data-overflow-x')).toBe(false);
		expect(viewport.hasAttribute('data-at-top')).toBe(true);
		expect(viewport.getAttribute('tabindex')).toBe(null);

		expect(root.style.getPropertyValue('--thumb-height')).toBe('20px');
		expect(root.hasAttribute('data-overflow-y')).toBe(true);
		expect(root.hasAttribute('data-overflow-x')).toBe(false);

		expect($('[data-part="corner"]')!.getAttribute('data-state')).toBe('hidden');

		expect(viewport.style.getPropertyValue('--scroll-area-overflow-y-start')).toBe('0px');
		expect(viewport.style.getPropertyValue('--scroll-area-overflow-y-end')).toBe('800px');
	});

	test('tracks scrolling state and side flags', async () => {
		const { viewport } = await setup();
		click('[data-testid="measure"]');

		viewport.scrollTop = 800;
		viewport.dispatchEvent(new Event('scroll'));
		await tick();

		expect(viewport.hasAttribute('data-at-bottom')).toBe(true);
		expect(viewport.hasAttribute('data-at-top')).toBe(false);
		expect($('[data-testid="scrollbar-y"]')!.hasAttribute('data-scrolling')).toBe(true);

		click('[data-testid="progress"]');
		expect($('[data-part="edges"]')!.textContent).toBe('false/true/true');
		expect(JSON.parse($('[data-part="progress"]')!.textContent!)).toEqual({ x: 0, y: 1 });
	});

	test('scrolls to an edge through the api', async () => {
		const { viewport } = await setup();
		click('[data-testid="measure"]');

		const calls: ScrollToOptions[] = [];
		Object.defineProperty(viewport, 'scrollTo', {
			configurable: true,
			value: (options: ScrollToOptions) => {
				calls.push(options);
			}
		});

		click('[data-testid="bottom"]');
		expect(calls).toEqual([{ behavior: 'auto', top: 800 }]);
	});

	test('drags the vertical thumb to scroll the viewport', async () => {
		const { viewport } = await setup();
		click('[data-testid="measure"]');

		const scrollbar = $('[data-testid="scrollbar-y"]')!;
		const thumb = $('[data-testid="thumb-y"]')!;
		mockMetrics(scrollbar, { offsetHeight: 400 });
		mockMetrics(thumb, { offsetHeight: 100 });

		const options = { bubbles: true, clientX: 5, pointerType: 'mouse', isPrimary: true };
		thumb.dispatchEvent(new PointerEvent('pointerdown', { ...options, button: 0, clientY: 100 }));
		await tick();
		expect(thumb.hasAttribute('data-dragging')).toBe(true);

		document.dispatchEvent(new PointerEvent('pointermove', { ...options, clientY: 180 }));
		await tick();
		expect(viewport.scrollTop).toBeCloseTo((80 / 300) * 800);

		document.dispatchEvent(new PointerEvent('pointerup', { ...options, clientY: 180 }));
		await tick();
		expect(thumb.hasAttribute('data-dragging')).toBe(false);
	});

	test('exposes per-orientation scrollbar hover state', async () => {
		const { root } = await setup();
		click('[data-testid="measure"]');

		root.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
		await tick();
		expect($('[data-testid="scrollbar-y"]')!.hasAttribute('data-hover')).toBe(true);

		root.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
		await tick();
		expect($('[data-testid="scrollbar-y"]')!.hasAttribute('data-hover')).toBe(false);
	});
});
