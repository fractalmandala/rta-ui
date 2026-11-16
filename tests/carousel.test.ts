import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase6Carousel from './harness/Phase6Carousel.svelte';
import Phase6CarouselProvider from './harness/Phase6CarouselProvider.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = <T extends Element = HTMLElement>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[];

const root = () => $('[data-scope="carousel"][data-part="root"]')!;
const itemGroup = () => $('[data-scope="carousel"][data-part="item-group"]')!;
const items = () => $$('[data-scope="carousel"][data-part="item"]');
const indicators = () => $$('[data-scope="carousel"][data-part="indicator"]');
const pageOutput = () => $('[data-testid="page"]')!;

const style = (selector: string) => $(selector)?.getAttribute('style') ?? '';
const setAxisSize = (nodes: Element[], size: number, axis: 'offsetWidth' | 'offsetHeight') => {
	for (const node of nodes) {
		Object.defineProperty(node, axis, { value: size, configurable: true });
	}
};

afterEach(() => {
	document.body.innerHTML = '';
	vi.useRealTimers();
});

describe('Carousel', () => {
	test('renders the Ark contract and the moduix hooks', () => {
		render(Phase6Carousel, { props: { slideCount: 4 } });

		const rootEl = root();
		expect(rootEl.getAttribute('data-slot')).toBe('carousel-root');
		expect(rootEl.getAttribute('role')).toBe('region');
		expect(rootEl.getAttribute('aria-roledescription')).toBe('carousel');
		expect(rootEl.getAttribute('data-orientation')).toBe('horizontal');
		expect(rootEl.id.startsWith('carousel:')).toBe(true);

		const group = itemGroup();
		expect(group.getAttribute('data-slot')).toBe('carousel-item-group');
		expect(group.getAttribute('data-orientation')).toBe('horizontal');
		expect(group.getAttribute('aria-live')).toBe('polite');
		expect(group.hasAttribute('data-dragging')).toBe(false);
		expect(group.id).toBe(`${rootEl.id}:item-group`);
		expect(group.getAttribute('tabindex')).toBe('0');

		const slides = items();
		expect(slides).toHaveLength(4);
		expect(slides[0].getAttribute('data-slot')).toBe('carousel-item');
		expect(slides[0].id).toBe(`${rootEl.id}:item:0`);
		expect(slides[0].getAttribute('role')).toBe('group');
		expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
		expect(slides[0].getAttribute('aria-label')).toBe('1 of 4');
		expect(slides[0].getAttribute('data-index')).toBe('0');
		expect(slides[0].hasAttribute('data-inview')).toBe(true);
		expect(slides[0].hasAttribute('aria-hidden')).toBe(false);
		expect(slides[1].hasAttribute('data-inview')).toBe(false);
		expect(slides[1].getAttribute('aria-hidden')).toBe('true');

		expect($('[data-part="control"]')!.getAttribute('data-slot')).toBe('carousel-control');
		expect($('[data-part="control"]')!.getAttribute('data-orientation')).toBe('horizontal');

		const prev = $('[data-part="prev-trigger"]')!;
		const next = $('[data-part="next-trigger"]')!;
		expect(prev.getAttribute('data-slot')).toBe('carousel-prev-trigger');
		expect(prev.getAttribute('type')).toBe('button');
		expect(prev.getAttribute('aria-label')).toBe('Previous slide');
		expect(prev.getAttribute('aria-controls')).toBe(group.id);
		expect(prev.id).toBe(`${rootEl.id}:prev-trigger`);
		expect(prev.hasAttribute('disabled')).toBe(true);
		expect(next.getAttribute('data-slot')).toBe('carousel-next-trigger');
		expect(next.getAttribute('aria-label')).toBe('Next slide');
		expect(next.id).toBe(`${rootEl.id}:next-trigger`);
		expect(next.hasAttribute('disabled')).toBe(false);

		const group2 = $('[data-part="indicator-group"]')!;
		expect(group2.getAttribute('data-slot')).toBe('carousel-indicator-group');
		expect(group2.id).toBe(`${rootEl.id}:indicator-group`);
		const dots = indicators();
		expect(dots).toHaveLength(4);
		expect(dots[0].getAttribute('data-slot')).toBe('carousel-indicator');
		expect(dots[0].getAttribute('data-index')).toBe('0');
		expect(dots[0].hasAttribute('data-current')).toBe(true);
		expect(dots[1].hasAttribute('data-current')).toBe(false);
		expect(dots[0].getAttribute('aria-label')).toBe('Go to slide 1');
		expect(dots[0].getAttribute('type')).toBe('button');

		const progress = $('[data-part="progress-text"]')!;
		expect(progress.getAttribute('data-slot')).toBe('carousel-progress-text');
		expect(progress.textContent?.trim()).toBe('1 / 4');

		const autoplayTrigger = $('[data-part="autoplay-trigger"]')!;
		expect(autoplayTrigger.getAttribute('data-slot')).toBe('carousel-autoplay-trigger');
		expect(autoplayTrigger.getAttribute('aria-label')).toBe('Start slide rotation');
		expect(autoplayTrigger.hasAttribute('data-pressed')).toBe(false);

		const autoplayIndicator = $('[data-part="autoplay-indicator"]')!;
		expect(autoplayIndicator.getAttribute('data-slot')).toBe('carousel-autoplay-indicator');
		expect(autoplayIndicator.hasAttribute('data-paused')).toBe(true);

		const spinner = $('[data-part="spinner"]')!;
		expect(spinner.getAttribute('data-slot')).toBe('carousel-spinner');
		expect(spinner.getAttribute('aria-hidden')).toBe('true');
		expect(spinner.hasAttribute('data-paused')).toBe(true);
	});

	test('writes the sizing custom properties and the track transform', () => {
		render(Phase6Carousel, { props: { slideCount: 4, spacing: '8px', slidesPerPage: 2 } });

		const rootStyle = style('[data-part="root"]');
		expect(rootStyle).toContain('--slide-count: 4');
		expect(rootStyle).toContain('--slides-per-page: 2');
		expect(rootStyle).toContain('--slide-spacing: 8px');
		expect(rootStyle).toContain(
			'--slide-size: calc(100% / var(--slides-per-page) - var(--slide-spacing) * (var(--slides-per-page) - 1) / var(--slides-per-page))'
		);

		const groupStyle = style('[data-part="item-group"]');
		expect(groupStyle).toContain('transform: translate3d(0px, 0px, 0');
		expect(groupStyle).toContain('transition: transform');
		expect(groupStyle).toContain('gap: var(--slide-spacing)');
		expect(groupStyle).toContain('flex-direction: row');
		expect(groupStyle).toContain('scroll-snap-type: x mandatory');

		expect(style('[data-part="item"]')).toContain('flex: 0 0 var(--slide-size)');

		expect($('[data-testid="pages"]')!.textContent).toBe('0,2');
		expect(items()[1].hasAttribute('data-inview')).toBe(true);
		expect(items()[2].hasAttribute('data-inview')).toBe(false);

		render(Phase6Carousel, { props: { autoSize: true, slideCount: 2 } });
		const autoSizeRoot = $$('[data-part="root"]')[1];
		expect(autoSizeRoot.getAttribute('style')).toContain('--slide-size: auto');
	});

	test('moves between pages with triggers, arrow keys and loop', async () => {
		const onPageChange = vi.fn();
		render(Phase6Carousel, { props: { onPageChange, slideCount: 4 } });

		expect(pageOutput().textContent).toBe('0');
		await fireEvent.click($('[data-part="next-trigger"]')!);
		expect(pageOutput().textContent).toBe('1');
		expect(onPageChange).toHaveBeenLastCalledWith({ page: 1, pageSnapPoint: 1 });
		expect($('[data-part="prev-trigger"]')!.hasAttribute('disabled')).toBe(false);

		await fireEvent.keyDown(itemGroup(), { key: 'ArrowRight' });
		expect(pageOutput().textContent).toBe('2');
		await fireEvent.keyDown(itemGroup(), { key: 'End' });
		expect(pageOutput().textContent).toBe('3');
		expect($('[data-part="next-trigger"]')!.hasAttribute('disabled')).toBe(true);
		await fireEvent.keyDown(itemGroup(), { key: 'ArrowLeft' });
		expect(pageOutput().textContent).toBe('2');
		await fireEvent.keyDown(itemGroup(), { key: 'Home' });
		expect(pageOutput().textContent).toBe('0');
		expect($('[data-part="prev-trigger"]')!.hasAttribute('disabled')).toBe(true);

		render(Phase6Carousel, { props: { loop: true, slideCount: 4 } });
		const roots = $$('[data-part="root"]');
		const nexts = roots[1].querySelectorAll('[data-part="next-trigger"]');
		const prevs = roots[1].querySelectorAll('[data-part="prev-trigger"]');
		expect(nexts[0].hasAttribute('disabled')).toBe(false);
		await fireEvent.click(prevs[0]);
		expect(roots[1].querySelector('[data-testid="page"]')!.textContent).toBe('3');
	});

	test('indicators set the page, honour readOnly and respond to keys', async () => {
		render(Phase6Carousel, {
			props: { indicators: 'custom', readOnlyIndicator: true, slideCount: 4 }
		});

		const dots = indicators();
		expect(dots).toHaveLength(4);
		expect(dots[1].hasAttribute('data-readonly')).toBe(true);

		await fireEvent.click(dots[0]);
		expect(pageOutput().textContent).toBe('0');

		await fireEvent.click(dots[1]);
		expect(pageOutput().textContent).toBe('0');

		const group = $('[data-part="indicator-group"]')!;
		await fireEvent.keyDown(group, { key: 'ArrowRight' });
		expect(pageOutput().textContent).toBe('1');
		expect(indicators()[1].hasAttribute('data-current')).toBe(true);
		expect(indicators()[1].getAttribute('aria-label')).toBe('Go to slide 2');

		await fireEvent.keyDown(group, { key: 'End' });
		expect(pageOutput().textContent).toBe('3');
		await fireEvent.keyDown(group, { key: 'Home' });
		expect(pageOutput().textContent).toBe('0');
	});

	test('drags with document pointer listeners and a commit threshold', async () => {
		const onDragStatusChange = vi.fn();
		render(Phase6Carousel, { props: { onDragStatusChange, slideCount: 4, threshold: 40 } });

		const group = itemGroup();

		await fireEvent.pointerDown(group, { button: 0, clientX: 200, clientY: 10, pointerType: 'touch' });
		expect(group.hasAttribute('data-dragging')).toBe(true);

		await fireEvent.pointerMove(document.body, { clientX: 190, clientY: 10, pointerType: 'touch' });
		await fireEvent.pointerUp(document.body, { clientX: 190, clientY: 10, pointerType: 'touch' });

		expect(group.hasAttribute('data-dragging')).toBe(false);
		expect(pageOutput().textContent).toBe('0');
		expect(onDragStatusChange).toHaveBeenCalledWith({
			type: 'dragging.start',
			isDragging: true,
			page: 0
		});

		await fireEvent.pointerDown(group, { button: 0, clientX: 200, clientY: 10, pointerType: 'touch' });
		await fireEvent.pointerMove(document.body, { clientX: 100, clientY: 10, pointerType: 'touch' });
		await fireEvent.pointerUp(document.body, { clientX: 100, clientY: 10, pointerType: 'touch' });

		expect(pageOutput().textContent).toBe('1');
		expect(onDragStatusChange).toHaveBeenLastCalledWith({
			type: 'dragging.end',
			isDragging: false,
			page: 1
		});

		await fireEvent.pointerDown(group, { button: 0, clientX: 100, clientY: 10, pointerType: 'touch' });
		await fireEvent.pointerMove(document.body, { clientX: 200, clientY: 10, pointerType: 'touch' });
		await fireEvent.pointerUp(document.body, { clientX: 200, clientY: 10, pointerType: 'touch' });

		expect(pageOutput().textContent).toBe('0');
	});

	test('translates the track by the measured slide size on both axes', async () => {
		render(Phase6Carousel, { props: { slideCount: 4 } });

		setAxisSize(items(), 300, 'offsetWidth');
		await fireEvent.click($('[data-testid="refresh"]')!);
		await fireEvent.click($('[data-part="next-trigger"]')!);

		expect(style('[data-part="item-group"]')).toContain('transform: translate3d(-300px, 0px, 0');

		await fireEvent.click($('[data-testid="last"]')!);
		expect(style('[data-part="item-group"]')).toContain('transform: translate3d(-900px, 0px, 0');

		render(Phase6Carousel, { props: { dir: 'rtl', slideCount: 2 } });
		const rtlRoot = $$('[data-part="root"]')[1];
		const rtlGroup = rtlRoot.querySelector('[data-part="item-group"]')!;
		setAxisSize(Array.from(rtlRoot.querySelectorAll('[data-part="item"]')), 150, 'offsetWidth');
		await fireEvent.click(rtlRoot.querySelector('[data-testid="refresh"]')!);
		await fireEvent.click(rtlRoot.querySelector('[data-part="next-trigger"]')!);
		expect(rtlGroup.getAttribute('style')).toContain('transform: translate3d(150px, 0px, 0');

		render(Phase6Carousel, { props: { orientation: 'vertical', slideCount: 3 } });
		const roots = $$('[data-part="root"]');
		const verticalRoot = roots[2];
		expect(verticalRoot.getAttribute('data-orientation')).toBe('vertical');
		const verticalGroup = verticalRoot.querySelector('[data-part="item-group"]')!;
		expect(verticalGroup.getAttribute('data-orientation')).toBe('vertical');
		expect(verticalGroup.getAttribute('style')).toContain('flex-direction: column');

		setAxisSize(Array.from(verticalRoot.querySelectorAll('[data-part="item"]')), 200, 'offsetHeight');
		await fireEvent.click(verticalRoot.querySelector('[data-testid="refresh"]')!);
		await fireEvent.click(verticalRoot.querySelector('[data-part="next-trigger"]')!);

		expect(verticalGroup.getAttribute('style')).toContain('transform: translate3d(0px, -200px, 0');
	});

	test('autoplays, counts down, pauses on hover and toggles from the trigger', async () => {
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
		const onAutoplayStatusChange = vi.fn();
		render(Phase6Carousel, {
			props: {
				autoplay: { delay: 2000 },
				loop: true,
				onAutoplayStatusChange,
				pauseOnHover: true,
				slideCount: 4
			}
		});

		const trigger = $('[data-part="autoplay-trigger"]')!;
		expect($('[data-testid="playing"]')!.textContent).toBe('true');
		expect(trigger.hasAttribute('data-pressed')).toBe(true);
		expect(trigger.getAttribute('aria-label')).toBe('Stop slide rotation');
		expect($('[data-part="item-group"]')!.getAttribute('aria-live')).toBe('off');
		expect($('[data-testid="remaining"]')!.textContent).toBe('2');

		await vi.advanceTimersByTimeAsync(1100);
		await tick();
		expect($('[data-testid="remaining"]')!.textContent).toBe('1');
		expect($('[data-part="autoplay-indicator"]')!.textContent?.trim()).toBe('1s');
		expect(style('[data-part="autoplay-indicator"]')).toContain('--autoplay-progress');

		await vi.advanceTimersByTimeAsync(1000);
		await tick();
		expect(pageOutput().textContent).toBe('1');
		expect(onAutoplayStatusChange).toHaveBeenCalledWith({
			type: 'autoplay',
			isPlaying: true,
			page: 1
		});

		await fireEvent.pointerEnter(root());
		await tick();
		expect($('[data-testid="playing"]')!.textContent).toBe('false');
		expect($('[data-part="autoplay-indicator"]')!.hasAttribute('data-paused')).toBe(true);
		expect($('[data-part="spinner"]')!.hasAttribute('data-paused')).toBe(true);

		const pageWhilePaused = pageOutput().textContent;
		await vi.advanceTimersByTimeAsync(4000);
		await tick();
		expect(pageOutput().textContent).toBe(pageWhilePaused);

		await fireEvent.pointerLeave(root());
		expect($('[data-testid="playing"]')!.textContent).toBe('true');

		await fireEvent.click(trigger);
		expect($('[data-testid="playing"]')!.textContent).toBe('false');
		expect(trigger.getAttribute('aria-label')).toBe('Start slide rotation');
		await fireEvent.click(trigger);
		expect($('[data-testid="playing"]')!.textContent).toBe('true');
	});

	test('shares state through CarouselRootProvider', async () => {
		render(Phase6CarouselProvider, { props: { slideCount: 3 } });

		const rootEl = root();
		expect(rootEl.getAttribute('data-slot')).toBe('carousel-root-provider');
		expect(indicators()).toHaveLength(3);
		expect($('[data-part="progress-text"]')!.textContent?.trim()).toBe('1 / 3');

		await fireEvent.click($('[data-part="next-trigger"]')!);
		expect(pageOutput().textContent).toBe('1');
		expect($('[data-part="progress-text"]')!.textContent?.trim()).toBe('2 / 3');
		expect(items()[0].hasAttribute('data-inview')).toBe(false);

		await fireEvent.click(indicators()[2]);
		expect(pageOutput().textContent).toBe('2');
		expect($('[data-part="next-trigger"]')!.hasAttribute('disabled')).toBe(true);
	});
});
