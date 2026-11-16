import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import Phase4Tour from './harness/Phase4Tour.svelte';

const q = (selector: string) => document.querySelector<HTMLElement>(selector);
const qa = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)];
const content = () => q('[data-scope="tour"][data-part="content"]');
const backdrop = () => q('[data-scope="tour"][data-part="backdrop"]');
const spotlight = () => q('[data-scope="tour"][data-part="spotlight"]');
const positioner = () => q('[data-scope="tour"][data-part="positioner"]');
const actionTrigger = (type: string) =>
	q(`[data-scope="tour"][data-part="action-trigger"][data-type="${type}"]`);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const click = async (testId: string) => {
	await fireEvent.click(q(`[data-testid="${testId}"]`)!);
	flushSync();
};

const mockRect = (
	element: HTMLElement,
	rect: { x: number; y: number; width: number; height: number }
) => {
	Object.defineProperty(element, 'getBoundingClientRect', {
		configurable: true,
		value: () => ({
			...rect,
			top: rect.y,
			left: rect.x,
			right: rect.x + rect.width,
			bottom: rect.y + rect.height
		})
	});
};

describe('Tour', () => {
	test('opens on a dialog step with the aria and id contract', async () => {
		render(Phase4Tour, {});
		expect(content()).toBeNull();

		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		const dialog = content()!;
		const title = q('[data-scope="tour"][data-part="title"]')!;
		const description = q('[data-scope="tour"][data-part="description"]')!;
		expect(dialog.getAttribute('role')).toBe('dialog');
		expect(dialog.getAttribute('aria-modal')).toBe('true');
		expect(dialog.getAttribute('aria-live')).toBe('polite');
		expect(dialog.getAttribute('aria-atomic')).toBe('true');
		expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
		expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
		expect(dialog.id).toBe('tour-content-harness');
		expect(dialog.getAttribute('data-state')).toBe('open');
		expect(dialog.getAttribute('data-type')).toBe('dialog');
		expect(dialog.getAttribute('data-step')).toBe('welcome');
		expect(dialog.getAttribute('data-slot')).toBe('tour-content');
		expect(dialog.getAttribute('tabindex')).toBe('-1');
		expect(dialog.hasAttribute('hidden')).toBe(false);
		expect(title.id).toBe('tour-title-harness');
		expect(description.id).toBe('tour-desc-harness');

		const overlay = backdrop()!;
		expect(overlay.id).toBe('tour-backdrop-harness');
		expect(overlay.getAttribute('data-state')).toBe('open');
		expect(overlay.getAttribute('data-type')).toBe('dialog');
		expect(overlay.style.position).toBe('fixed');
		expect(overlay.style.clipPath).toBe('');
		expect(spotlight()!.hasAttribute('hidden')).toBe(true);
		expect(positioner()!.id).toBe('tour-positioner-harness');
		expect(positioner()!.getAttribute('data-type')).toBe('dialog');

		const close = q('[data-scope="tour"][data-part="close-trigger"]')!;
		expect(close.getAttribute('aria-label')).toBe('close tour');
		expect(close.getAttribute('data-slot')).toBe('tour-close-icon');
		expect(q('[data-scope="tour"][data-part="progress-text"]')!.textContent?.trim()).toBe('1 of 3');
		expect(q('[data-testid="status"]')!.textContent).toBe('started');
	});

	test('moves to a tooltip step, positions it and cuts the spotlight', async () => {
		render(Phase4Tour, {});
		mockRect(document.getElementById('tour-upload')!, { x: 100, y: 100, width: 80, height: 40 });
		await click('start');
		await click('next');
		await waitFor(() => expect(content()!.getAttribute('data-step')).toBe('upload'));
		await waitFor(() => expect(spotlight()!.style.getPropertyValue('--spotlight-width')).not.toBe(''));

		const target = document.getElementById('tour-upload')!;
		expect(target.getAttribute('data-tour-highlighted')).toBe('');
		expect(target.hasAttribute('inert')).toBe(false);

		const glow = spotlight()!;
		expect(glow.hasAttribute('hidden')).toBe(false);
		expect(glow.style.position).toBe('absolute');
		expect(glow.style.width).toBe('var(--spotlight-width)');
		expect(glow.style.left).toBe('var(--spotlight-x)');
		expect(glow.style.pointerEvents).toBe('none');
		expect(glow.style.getPropertyValue('--spotlight-x')).toBe('90px');
		expect(glow.style.getPropertyValue('--spotlight-y')).toBe('90px');
		expect(glow.style.getPropertyValue('--spotlight-width')).toBe('100px');
		expect(glow.style.getPropertyValue('--spotlight-height')).toBe('60px');

		const overlay = backdrop()!;
		expect(overlay.getAttribute('data-type')).toBe('tooltip');
		expect(overlay.style.position).toBe('absolute');
		expect(overlay.style.getPropertyValue('will-change')).toBe('clip-path');
		expect(overlay.style.clipPath.startsWith('path("M')).toBe(true);

		const popper = positioner()!;
		expect(popper.getAttribute('data-type')).toBe('tooltip');
		// jsdom reports a zero-size viewport, so flip may move the tooltip above the target.
		const placement = popper.getAttribute('data-placement')!;
		expect(['top', 'bottom']).toContain(placement.split('-')[0]);
		expect(popper.getAttribute('data-side')).toBe(placement.split('-')[0]);
		expect(popper.style.getPropertyValue('--tour-layer')).toBe('2');
		expect(popper.style.position).toBe('absolute');
		expect(popper.style.transform).toContain('translate3d(var(--x');

		const arrow = q('[data-scope="tour"][data-part="arrow"]')!;
		expect(arrow).not.toBeNull();
		expect(arrow.style.visibility).toBe('');
		expect(content()!.getAttribute('data-placement')).toBe(placement);
	});

	test('navigates with the keyboard and ignores it when disabled', async () => {
		render(Phase4Tour, {});
		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		const dialog = content()!;
		dialog.focus();
		await fireEvent.keyDown(dialog, { key: 'ArrowRight' });
		flushSync();
		expect(content()!.getAttribute('data-step')).toBe('upload');

		await fireEvent.keyDown(content()!, { key: 'ArrowLeft' });
		flushSync();
		expect(content()!.getAttribute('data-step')).toBe('welcome');

		await fireEvent.keyDown(content()!, { key: 'Enter' });
		flushSync();
		expect(content()!.getAttribute('data-step')).toBe('upload');
	});

	test('closes on escape and restores focus to the page', async () => {
		render(Phase4Tour, {});
		const start = q('[data-testid="start"]')!;
		start.focus();
		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		flushSync();

		expect(q('[data-testid="status"]')!.textContent).toBe('dismissed');
		await waitFor(() => expect(content()).toBeNull(), { timeout: 1500 });
		await waitFor(() => expect(document.activeElement).toBe(start), { timeout: 1500 });
	});

	test('restarts from the first step when started again while open', async () => {
		render(Phase4Tour, {});
		await click('start');
		await click('next');
		await waitFor(() => expect(content()!.getAttribute('data-step')).toBe('upload'));

		await click('start');
		await waitFor(() => expect(content()!.getAttribute('data-step')).toBe('welcome'));
		expect(q('[data-testid="status"]')!.textContent).toBe('started');
	});

	test('does not close on escape when closeOnEscape is false', async () => {
		render(Phase4Tour, { closeOnEscape: false });
		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		flushSync();

		expect(content()).not.toBeNull();
	});

	test('runs the step actions and reports their disabled state', async () => {
		render(Phase4Tour, {});
		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		expect(actionTrigger('prev')).toBeNull();
		const next = actionTrigger('next')!;
		expect(next.getAttribute('data-disabled')).toBeNull();

		await fireEvent.click(next);
		flushSync();
		await waitFor(() => expect(content()!.getAttribute('data-step')).toBe('upload'));
		expect(actionTrigger('prev')!.hasAttribute('disabled')).toBe(false);

		await fireEvent.click(actionTrigger('next')!);
		flushSync();
		await waitFor(() => expect(content()!.getAttribute('data-step')).toBe('finish'));
		expect(actionTrigger('next')).toBeNull();
		expect(actionTrigger('close')!.textContent?.trim()).toBe('Finish');

		await fireEvent.click(actionTrigger('close')!);
		flushSync();
		expect(q('[data-testid="status"]')!.textContent).toBe('completed');
	});

	test('dismisses through the close trigger, the finish action and skip', async () => {
		render(Phase4Tour, {});
		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		await fireEvent.click(q('[data-scope="tour"][data-part="close-trigger"]')!);
		flushSync();
		expect(q('[data-testid="status"]')!.textContent).toBe('dismissed');
		await waitFor(() => expect(content()).toBeNull(), { timeout: 1500 });

		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());
		await click('skip');
		expect(q('[data-testid="status"]')!.textContent).toBe('skipped');
		await waitFor(() => expect(content()).toBeNull(), { timeout: 1500 });
	});

	test('dismisses on an outside pointer but not on the highlighted target', async () => {
		render(Phase4Tour, {});
		const target = document.getElementById('tour-upload')!;
		mockRect(target, { x: 100, y: 100, width: 80, height: 40 });
		await click('start-upload');
		await waitFor(() => expect(content()).not.toBeNull());

		await fireEvent.pointerDown(target, { clientX: 120, clientY: 110 });
		flushSync();
		expect(content()).not.toBeNull();

		await fireEvent.pointerDown(document.body, { clientX: 900, clientY: 900 });
		flushSync();
		expect(q('[data-testid="status"]')!.textContent).toBe('dismissed');
	});

	test('renders the progress bar and the highlighted target contract', async () => {
		render(Phase4Tour, {});
		await click('start');
		await waitFor(() => expect(content()).not.toBeNull());

		const bar = q('[data-scope="tour"][data-part="progress-bar"]')!;
		expect(bar.getAttribute('role')).toBe('progressbar');
		expect(bar.getAttribute('aria-valuemin')).toBe('0');
		expect(bar.getAttribute('aria-valuemax')).toBe('100');
		expect(Number(bar.getAttribute('aria-valuenow'))).toBeCloseTo(100 / 3, 3);
		expect(q('[data-slot="tour-progress-bar-fill"]')!.style.width).toContain('%');
	});

	test('waits for a late mounted target before opening the step', async () => {
		render(Phase4Tour, { lateTarget: true });
		await click('start-upload');
		await wait(40);

		await waitFor(() => expect(document.getElementById('tour-upload')).not.toBeNull());
		await waitFor(() => expect(content()).not.toBeNull(), { timeout: 1500 });
		expect(content()!.getAttribute('data-step')).toBe('upload');
	});

	test('marks the target inert when interaction is prevented', async () => {
		render(Phase4Tour, { preventInteraction: true });
		await click('start-upload');
		await waitFor(() => expect(content()).not.toBeNull());

		const target = document.getElementById('tour-upload') as HTMLElement & { inert: boolean };
		expect(target.inert).toBe(true);
		expect(target.getAttribute('data-tour-highlighted')).toBe('');

		await fireEvent.click(q('[data-scope="tour"][data-part="close-trigger"]')!);
		flushSync();
		await waitFor(() => expect(target.hasAttribute('data-tour-highlighted')).toBe(false), {
			timeout: 1500
		});
	});

	test('renders nothing while closed for the props based root', async () => {
		render(Phase4Tour, { rootMode: true });
		expect(content()).toBeNull();
		expect(backdrop()).toBeNull();
		expect(qa('[data-scope="tour"]')).toHaveLength(0);
	});
});
