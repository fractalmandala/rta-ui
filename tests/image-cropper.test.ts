import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Phase6ImageCropper from './harness/Phase6ImageCropper.svelte';
import Phase6ImageCropperProvider from './harness/Phase6ImageCropperProvider.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const root = () => $('[data-scope="image-cropper"][data-part="root"]')!;
const viewport = () => $('[data-part="viewport"]')!;
const image = () => $<HTMLImageElement>('[data-part="image"]')!;
const selection = () => $('[data-part="selection"]')!;
const handles = () => $$('[data-part="handle"]');
const out = (id: string) => $(`[data-testid="${id}"]`)!.textContent?.trim() ?? '';

const VIEWPORT = { width: 400, height: 250 };

function mockRect(width = VIEWPORT.width, height = VIEWPORT.height) {
	return {
		width,
		height,
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		x: 0,
		y: 0,
		toJSON: () => ({})
	} as DOMRect;
}

function pointer(type: string, target: EventTarget, x: number, y: number) {
	const event = new Event(type, { bubbles: true, cancelable: true });
	Object.defineProperties(event, {
		clientX: { value: x },
		clientY: { value: y },
		button: { value: 0 },
		pointerType: { value: 'mouse' },
		shiftKey: { value: false },
		altKey: { value: false }
	});
	target.dispatchEvent(event);
}

function styleVar(name: string) {
	const style = root().getAttribute('style') ?? '';
	return style.match(new RegExp(`${name}: (-?[\\d.]+)`))?.[1] ?? '';
}

const cropFromStyle = () =>
	['--crop-x', '--crop-y', '--crop-width', '--crop-height'].map((name) =>
		Math.round(Number(styleVar(name)))
	);

async function markImageLoaded() {
	const element = image();
	Object.defineProperty(element, 'complete', { value: true, configurable: true });
	Object.defineProperty(element, 'naturalWidth', { value: 800, configurable: true });
	Object.defineProperty(element, 'naturalHeight', { value: 500, configurable: true });
	await fireEvent.load(element);
}

async function mountCropper(props: Record<string, unknown> = {}) {
	const result = render(Phase6ImageCropper, { props });
	await markImageLoaded();
	return result;
}

async function mountProvider(props: Record<string, unknown> = {}) {
	const result = render(Phase6ImageCropperProvider, { props });
	await markImageLoaded();
	return result;
}

describe('ImageCropper', () => {
	beforeEach(() => {
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => mockRect());
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
			null as unknown as CanvasRenderingContext2D
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('renders every anatomy part with scope, part and slot hooks', async () => {
		await mountCropper();

		expect(root().getAttribute('data-slot')).toBe('image-cropper-root');
		expect(root().getAttribute('role')).toBe('group');
		expect(root().getAttribute('aria-label')).toBe('Image cropper');
		expect(root().getAttribute('aria-roledescription')).toBe('Image cropper');
		expect(root().getAttribute('aria-live')).toBe('polite');
		expect(root().getAttribute('aria-controls')).toBe(`${viewport().id} ${selection().id}`);
		expect(root().id).toMatch(/^image-cropper:/);
		expect(viewport().getAttribute('role')).toBe('presentation');
		expect(viewport().getAttribute('data-ownedby')).toBe(root().id);
		expect(viewport().getAttribute('style')).toContain('overflow: hidden');
		expect(image().getAttribute('alt')).toBe('');
		expect(image().getAttribute('aria-hidden')).toBe('true');
		expect(image().getAttribute('data-ownedby')).toBe(viewport().id);
		expect(image().getAttribute('draggable')).toBe('false');
		expect(image().hasAttribute('data-ready')).toBe(true);
		expect(selection().getAttribute('role')).toBe('slider');
		expect(selection().getAttribute('tabindex')).toBe('0');
		expect(selection().getAttribute('aria-roledescription')).toBe('2d slider');
		expect(selection().getAttribute('aria-valuemin')).toBe('0');
		expect(selection().getAttribute('aria-valuemax')).toBe('80');
		expect(selection().getAttribute('aria-valuenow')).toBe('40');
		expect(selection().getAttribute('data-slot')).toBe('image-cropper-selection');
		expect($$('[data-part="grid"]')).toHaveLength(2);
		expect($('[data-part="grid"]')!.getAttribute('data-axis')).toBe('horizontal');
		expect($('[data-part="grid"]')!.getAttribute('style')).toContain('inset: 33.33% 0');
		expect(handles()).toHaveLength(8);
		expect(handles().map((node) => node.getAttribute('data-position'))).toEqual([
			'nw',
			'n',
			'ne',
			'e',
			'se',
			's',
			'sw',
			'w'
		]);
		expect(handles()[0].id).toBe(`${root().id}:handle:nw`);
		expect(handles()[0].getAttribute('style')).toContain('cursor: nw-resize');
		expect(handles()[1].getAttribute('style')).toContain('width: 96%');
		expect(handles()[1].getAttribute('data-slot')).toBe('image-cropper-handle');
	});

	test('measures the viewport into a centered default crop and writes the css variables', async () => {
		await mountCropper();

		expect(cropFromStyle()).toEqual([40, 25, 320, 200]);
		expect(styleVar('--image-zoom')).toBe('1');
		expect(styleVar('--image-rotation')).toBe('0');
		expect(selection().getAttribute('style')).toContain('top: var(--crop-y)');
		expect(selection().getAttribute('style')).toContain('width: var(--crop-width)');
		expect(selection().hasAttribute('data-measured')).toBe(true);
		expect(selection().getAttribute('aria-valuetext')).toBe(
			'Position X 40px, Y 25px. Size 320px by 200px.'
		);
		expect(image().getAttribute('style')).toContain('transform: matrix(1, 0, 0, 1, 0, 0)');
	});

	test('applies the aspect ratio to the crop area', async () => {
		await mountCropper({ aspectRatio: 16 / 9 });

		const [x, y, width, height] = cropFromStyle();
		expect(x).toBe(40);
		expect(y).toBe(35);
		expect(width / height).toBeCloseTo(16 / 9);
	});

	test('zooms with the wheel and clamps between minZoom and maxZoom', async () => {
		await mountCropper({ minZoom: 1, maxZoom: 1.2, zoomStep: 0.1 });

		await fireEvent.wheel(viewport(), { deltaY: -100, clientX: 100, clientY: 100 });
		await waitFor(() => expect(Number(out('zoom'))).toBeCloseTo(1.1));
		expect(Number(styleVar('--image-zoom'))).toBeCloseTo(1.1);

		await fireEvent.wheel(viewport(), { deltaY: -100, clientX: 100, clientY: 100 });
		await waitFor(() => expect(Number(out('zoom'))).toBeCloseTo(1.2));

		await fireEvent.wheel(viewport(), { deltaY: -100, clientX: 100, clientY: 100 });
		expect(Number(out('zoom'))).toBeCloseTo(1.2);

		await fireEvent.wheel(viewport(), { deltaY: 100, clientX: 100, clientY: 100 });
		await waitFor(() => expect(Number(out('zoom'))).toBeCloseTo(1.1));

		await fireEvent.wheel(viewport(), { deltaY: 100, clientX: 100, clientY: 100 });
		await waitFor(() => expect(Number(out('zoom'))).toBeCloseTo(1));
	});

	test('resizes the crop from a handle using ownerDocument pointer events', async () => {
		await mountCropper();
		const handle = handles().find((node) => node.getAttribute('data-position') === 'se')!;

		pointer('pointerdown', handle, 100, 100);
		await waitFor(() => expect(root().hasAttribute('data-dragging')).toBe(true));

		pointer('pointermove', document, 120, 110);
		await waitFor(() => expect(cropFromStyle()).toEqual([40, 25, 340, 210]));

		pointer('pointerup', document, 120, 110);
		await waitFor(() => expect(root().hasAttribute('data-dragging')).toBe(false));
		expect(selection().hasAttribute('data-dragging')).toBe(false);
	});

	test('moves the crop area by dragging the selection, clamped to the viewport', async () => {
		await mountCropper();

		pointer('pointerdown', selection(), 100, 100);
		pointer('pointermove', document, 120, 110);
		await waitFor(() => expect(cropFromStyle()).toEqual([60, 35, 320, 200]));

		pointer('pointermove', document, 400, 400);
		await waitFor(() => expect(cropFromStyle()).toEqual([80, 50, 320, 200]));
		pointer('pointerup', document, 400, 400);
	});

	test('nudges and resizes the crop from the keyboard, and zooms with plus', async () => {
		await mountCropper();

		await fireEvent.keyDown(selection(), { key: 'ArrowRight' });
		await waitFor(() => expect(cropFromStyle()[0]).toBe(41));

		await fireEvent.keyDown(selection(), { key: 'ArrowDown', shiftKey: true });
		await waitFor(() => expect(cropFromStyle()[1]).toBe(35));

		await fireEvent.keyDown(selection(), { key: 'ArrowRight', altKey: true });
		await waitFor(() => expect(cropFromStyle()).toEqual([41, 35, 321, 200]));

		await fireEvent.keyDown(selection(), { key: '+' });
		await waitFor(() => expect(Number(out('zoom'))).toBeCloseTo(1.1));
	});

	test('keeps the zoom, rotation and flip props controlled by the root', async () => {
		await mountCropper();

		await fireEvent.click($('[data-testid="rotate"]')!);
		await waitFor(() => expect(out('rotation')).toBe('90'));
		expect(styleVar('--image-rotation')).toBe('90');
		expect(image().getAttribute('style')).not.toContain('matrix(1, 0, 0, 1, 0, 0)');
		expect(viewport().getAttribute('data-slot')).toBe('image-cropper-viewport');

		await fireEvent.click($('[data-testid="rotate-back"]')!);
		await waitFor(() => expect(out('rotation')).toBe('0'));
	});

	test('pans the image over a fixed crop area and reports panning', async () => {
		await mountProvider({ fixedCropArea: true });

		expect(selection().hasAttribute('data-disabled')).toBe(true);
		pointer('pointerdown', selection(), 100, 100);
		await waitFor(() => expect(out('panning')).toBe('true'));

		pointer('pointermove', document, 130, 120);
		await waitFor(() => expect(styleVar('--image-offset-x')).not.toBe('0'));
		pointer('pointerup', document, 130, 120);
		await waitFor(() => expect(out('panning')).toBe('false'));
	});

	test('exposes the api: crop data, rotation, flip, reset and a null export', async () => {
		await mountProvider();

		expect(out('viewport-size')).toBe('400x250');

		await fireEvent.click($('[data-testid="read-crop"]')!);
		await waitFor(() => expect(out('crop-data')).toBe('80,50,640,400'));

		await fireEvent.click($('[data-testid="rotate"]')!);
		await waitFor(() => expect(out('rotation')).toBe('90'));

		await fireEvent.click($('[data-testid="flip-x"]')!);
		await waitFor(() => expect(out('flip')).toBe('true-false'));
		expect(image().hasAttribute('data-flip-horizontal')).toBe(true);

		await fireEvent.click($('[data-testid="export"]')!);
		await waitFor(() => expect(out('exported')).toBe('null'));

		await fireEvent.click($('[data-testid="reset"]')!);
		await waitFor(() => expect(out('rotation')).toBe('0'));
		expect(out('flip')).toBe('false-false');
		expect(root().getAttribute('data-slot')).toBe('image-cropper-root-provider');
	});
});
