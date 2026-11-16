import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase6Lightbox from './harness/Phase6Lightbox.svelte';

const $ = (selector: string) => document.querySelector<HTMLElement>(selector);
const $$ = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)];

const triggerOf = () => $('[data-scope="dialog"][data-part="trigger"]')!;
const contentOf = () => $('[data-scope="dialog"][data-part="content"]');
const imageOf = () => $('[data-scope="lightbox"][data-part="image"]') as HTMLImageElement | null;
const counterOf = () => $('[data-part="counter"]');
const viewportOf = () => $('[data-part="viewport"]');

async function open(props: Record<string, unknown> = {}) {
	const result = render(Phase6Lightbox, { props });
	await fireEvent.click(triggerOf());
	flushSync();
	return result;
}

describe('Lightbox', () => {
	test('composes the dialog shell and keeps the lightbox hooks on its own parts', () => {
		render(Phase6Lightbox, { props: {} });

		const trigger = triggerOf();
		expect(trigger.getAttribute('data-slot')).toBe('dialog-trigger');
		expect(trigger.getAttribute('data-lightbox-slot')).toBe('trigger');
		expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect($('[data-part="viewport"]')).toBeNull();
	});

	test('shows the first image with counter, thumbnails and disabled prev', async () => {
		await open();

		const content = contentOf()!;
		expect(content.getAttribute('data-lightbox-slot')).toBe('content');
		expect($('[data-part="backdrop"]')!.getAttribute('data-lightbox-slot')).toBe('backdrop');
		expect($('[data-part="positioner"]')!.getAttribute('data-lightbox-slot')).toBe('positioner');
		expect($('[data-part="title"]')!.getAttribute('data-lightbox-slot')).toBe('title');

		const image = imageOf()!;
		expect(image.getAttribute('data-slot')).toBe('lightbox-image');
		expect(image.getAttribute('src')).toBe('https://example.test/one.jpg');
		expect(image.getAttribute('alt')).toBe('One');
		expect(image.getAttribute('data-index')).toBe('0');
		expect(image.style.transform).toContain('scale(1)');

		const viewport = viewportOf()!;
		expect(viewport.getAttribute('data-state')).toBe('open');
		expect(viewport.getAttribute('data-index')).toBe('0');
		expect(viewport.getAttribute('data-count')).toBe('3');

		expect(counterOf()!.textContent?.trim()).toBe('1 / 3');
		expect($('[data-part="caption"]')!.textContent?.trim()).toBe('The first image');

		const thumbnails = $$('[data-part="thumbnail"]');
		expect(thumbnails).toHaveLength(3);
		expect(thumbnails[0].getAttribute('data-active')).toBe('');
		expect(thumbnails[0].getAttribute('aria-current')).toBe('true');
		expect(thumbnails[1].hasAttribute('data-active')).toBe(false);

		const prev = $('[data-part="prev-trigger"]') as HTMLButtonElement;
		const next = $('[data-part="next-trigger"]') as HTMLButtonElement;
		expect(prev.disabled).toBe(true);
		expect(prev.getAttribute('aria-label')).toBe('Previous image');
		expect(prev.getAttribute('aria-controls')).toBe(viewport.id);
		expect(next.disabled).toBe(false);
	});

	test('navigates with the next and prev buttons', async () => {
		const onIndexChange = vi.fn();
		await open({ onIndexChange });

		await fireEvent.click($('[data-part="next-trigger"]')!);
		flushSync();

		expect(onIndexChange).toHaveBeenCalledWith({ index: 1 });
		expect(imageOf()!.getAttribute('src')).toBe('https://example.test/two.jpg');
		expect(imageOf()!.getAttribute('data-index')).toBe('1');
		expect(counterOf()!.textContent?.trim()).toBe('2 / 3');
		expect($('[data-part="caption"]')!.textContent?.trim()).toBe('The second image');
		expect(($('[data-part="prev-trigger"]') as HTMLButtonElement).disabled).toBe(false);
		expect($('[data-testid="index"]')!.textContent).toBe('1');

		await fireEvent.click($('[data-part="prev-trigger"]')!);
		flushSync();
		expect(imageOf()!.getAttribute('src')).toBe('https://example.test/one.jpg');
	});

	test('navigates with ArrowLeft and ArrowRight, and stops at the last image', async () => {
		await open();

		await fireEvent.keyDown(document.body, { key: 'ArrowRight' });
		flushSync();
		expect(imageOf()!.getAttribute('data-index')).toBe('1');

		await fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
		flushSync();
		expect(imageOf()!.getAttribute('data-index')).toBe('0');

		await fireEvent.keyDown(document.body, { key: 'ArrowRight' });
		await fireEvent.keyDown(document.body, { key: 'ArrowRight' });
		await fireEvent.keyDown(document.body, { key: 'ArrowRight' });
		flushSync();
		expect(imageOf()!.getAttribute('data-index')).toBe('2');
		expect(($('[data-part="next-trigger"]') as HTMLButtonElement).disabled).toBe(true);
	});

	test('wraps around when loop is enabled', async () => {
		await open({ loop: true });

		await fireEvent.click($('[data-part="prev-trigger"]')!);
		flushSync();
		expect(imageOf()!.getAttribute('data-index')).toBe('2');

		await fireEvent.click($('[data-part="next-trigger"]')!);
		flushSync();
		expect(imageOf()!.getAttribute('data-index')).toBe('0');
	});

	test('jumps to an image from the thumbnails', async () => {
		await open();

		await fireEvent.click($$('[data-part="thumbnail"]')[2]);
		flushSync();

		expect(imageOf()!.getAttribute('data-index')).toBe('2');
		expect(counterOf()!.textContent?.trim()).toBe('3 / 3');
		expect($$('[data-part="thumbnail"]')[2].getAttribute('data-active')).toBe('');
		expect($$('[data-part="thumbnail"]')[0].hasAttribute('data-active')).toBe(false);
	});

	test('scales the image with the zoom trigger and resets it', async () => {
		const onZoomChange = vi.fn();
		await open({ onZoomChange });

		const zoomTrigger = $('[data-part="zoom-trigger"]')!;
		expect(zoomTrigger.getAttribute('aria-pressed')).toBe('false');
		expect(zoomTrigger.getAttribute('aria-label')).toBe('Zoom in');

		await fireEvent.click(zoomTrigger);
		flushSync();

		expect(onZoomChange).toHaveBeenCalledWith({ zoom: 1.5 });
		expect(imageOf()!.style.transform).toContain('scale(1.5)');
		expect(imageOf()!.getAttribute('data-zoom')).toBe('1.5');
		expect(zoomTrigger.getAttribute('aria-pressed')).toBe('true');
		expect(zoomTrigger.getAttribute('aria-label')).toBe('Reset zoom');

		await fireEvent.click(zoomTrigger);
		flushSync();
		expect(imageOf()!.style.transform).toContain('scale(1)');
		expect(zoomTrigger.getAttribute('aria-pressed')).toBe('false');
	});

	test('offers the current image for download', async () => {
		await open();

		const download = $('[data-part="download-trigger"]') as HTMLAnchorElement;
		expect(download.getAttribute('href')).toBe('https://example.test/one.jpg');
		expect(download.hasAttribute('download')).toBe(true);
		expect(download.getAttribute('aria-label')).toBe('Download image');

		await fireEvent.click($('[data-part="next-trigger"]')!);
		flushSync();
		expect(download.getAttribute('href')).toBe('https://example.test/two.jpg');
	});

	test('closes on Escape and restores focus to the trigger', async () => {
		const onOpenChange = vi.fn();
		render(Phase6Lightbox, { props: { onOpenChange } });
		const trigger = triggerOf();
		trigger.focus();
		await fireEvent.click(trigger);
		flushSync();
		expect(contentOf()).not.toBeNull();

		await fireEvent.keyDown(document.body, { key: 'Escape' });

		expect(onOpenChange).toHaveBeenCalledWith({ open: false });
		await waitFor(() => expect(contentOf()).toBeNull());
		expect(document.activeElement).toBe(trigger);
	});
});
