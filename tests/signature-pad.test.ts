import { fireEvent, render } from '@testing-library/svelte';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { getStroke, getSvgPathFromStroke } from '../src/lib/components/signature-pad/index';
import Phase3SignaturePad from './harness/Phase3SignaturePad.svelte';
import Phase3SignaturePadApi from './harness/Phase3SignaturePadApi.svelte';
import Phase3SignaturePadField from './harness/Phase3SignaturePadField.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

const $$ = <T extends Element = HTMLElement>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[];

const drawImage = vi.fn();

beforeAll(() => {
	// jsdom ships no canvas backend: the 2d context and the encoder are stubbed so the raster path
	// runs, and `Image` resolves immediately because jsdom never decodes an SVG data URL.
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
		() => ({ drawImage }) as unknown as CanvasRenderingContext2D
	);
	vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
		() => 'data:image/png;base64,c2lnbmF0dXJl'
	);
	vi.stubGlobal(
		'Image',
		class {
			onload: (() => void) | null = null;
			onerror: (() => void) | null = null;
			set src(_value: string) {
				queueMicrotask(() => this.onload?.());
			}
		}
	);
});

beforeEach(() => {
	drawImage.mockClear();
});

function mockRect(element: Element, width = 200, height = 100) {
	vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
		width,
		height,
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		x: 0,
		y: 0,
		toJSON: () => ({})
	} as DOMRect);
}

const strokes = [
	[10, 10],
	[40, 20],
	[80, 50],
	[120, 30]
] as const;

async function draw(control: HTMLElement, points: ReadonlyArray<readonly [number, number]> = strokes) {
	const [start, ...rest] = points;
	await fireEvent.pointerDown(control, {
		clientX: start[0],
		clientY: start[1],
		pointerId: 1,
		button: 0,
		pressure: 0.5
	});
	for (const [clientX, clientY] of rest) {
		await fireEvent.pointerMove(document, { clientX, clientY, pointerId: 1, pressure: 0.6 });
	}
	const end = points[points.length - 1];
	await fireEvent.pointerUp(document, { clientX: end[0], clientY: end[1], pointerId: 1 });
}

describe('SignaturePad', () => {
	test('renders the Ark contract', () => {
		render(Phase3SignaturePad);

		const root = $('[data-scope="signature-pad"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('signature-pad-root');

		const label = $('[data-part="label"]')!;
		expect(label.tagName).toBe('LABEL');
		expect(label.getAttribute('data-slot')).toBe('signature-pad-label');

		const control = $('[data-part="control"]')!;
		expect(control.getAttribute('data-slot')).toBe('signature-pad-control');
		expect(control.getAttribute('role')).toBe('application');
		expect(control.getAttribute('aria-roledescription')).toBe('signature pad');
		expect(control.getAttribute('aria-label')).toBe('signature pad');
		expect(control.getAttribute('tabindex')).toBe('0');
		expect(control.style.position).toBe('relative');
		expect(control.style.touchAction).toBe('none');
		expect(control.style.userSelect).toBe('none');

		const segment = $<SVGSVGElement>('[data-part="segment"]')!;
		expect(segment.getAttribute('data-slot')).toBe('signature-pad-segment');
		expect(segment.namespaceURI).toBe('http://www.w3.org/2000/svg');
		expect(segment.querySelector('title')!.textContent).toBe('Signature');
		expect(segment.getAttribute('aria-hidden')).toBeNull();
		expect(segment.style.position).toBe('absolute');
		expect(segment.style.pointerEvents).toBe('none');
		expect(segment.style.width).toBe('100%');

		const guide = $('[data-part="guide"]')!;
		expect(guide.getAttribute('data-slot')).toBe('signature-pad-guide');
		expect(guide.getAttribute('data-disabled')).toBeNull();

		const clearTrigger = $('[data-part="clear-trigger"]')!;
		expect(clearTrigger.getAttribute('data-slot')).toBe('signature-pad-clear-trigger');
		expect(clearTrigger.tagName).toBe('BUTTON');
		expect(clearTrigger.getAttribute('type')).toBe('button');
		expect(clearTrigger.getAttribute('aria-label')).toBe('clear signature');
		expect(clearTrigger.hasAttribute('hidden')).toBe(true);

		const input = $<HTMLInputElement>('[data-part="hidden-input"]')!;
		expect(input.getAttribute('data-slot')).toBe('signature-pad-hidden-input');
		expect(input.type).toBe('text');
		expect(input.hidden).toBe(true);
		expect(input.readOnly).toBe(true);
		expect(input.name).toBe('signature');
	});

	test('derives every id from one uid and links the label to the hidden input', () => {
		render(Phase3SignaturePad);

		const root = $('[data-part="root"]')!;
		const control = $('[data-part="control"]')!;
		const label = $('[data-part="label"]')!;
		const input = $('[data-part="hidden-input"]')!;

		const uid = root.id.replace(/^signature-/, '');
		expect(uid.length).toBeGreaterThan(0);
		expect(control.id).toBe(`signature-control-${uid}`);
		expect(label.id).toBe(`signature-label-${uid}`);
		expect(input.id).toBe(`signature-input-${uid}`);
		expect(label.getAttribute('for')).toBe(`signature-input-${uid}`);
	});

	test('captures a stroke from pointer moves on the owner document', async () => {
		const onDraw = vi.fn();
		const onDrawEnd = vi.fn();
		render(Phase3SignaturePad, { props: { onDraw, onDrawEnd } });

		const control = $('[data-part="control"]')!;
		mockRect(control);

		await fireEvent.pointerDown(control, {
			clientX: 10,
			clientY: 10,
			pointerId: 1,
			button: 0,
			pressure: 0.5
		});
		expect(onDraw).not.toHaveBeenCalled();

		await fireEvent.pointerMove(document, { clientX: 40, clientY: 20, pointerId: 1, pressure: 0.6 });
		expect(onDraw).toHaveBeenCalledTimes(1);
		expect(onDraw.mock.calls[0][0].currentPath).toMatch(/^M/);

		await fireEvent.pointerMove(document, { clientX: 80, clientY: 50, pointerId: 1, pressure: 0.7 });
		await fireEvent.pointerUp(document, { clientX: 80, clientY: 50, pointerId: 1 });

		expect(onDrawEnd).toHaveBeenCalledTimes(1);
		const details = onDrawEnd.mock.calls[0][0];
		expect(details.paths).toHaveLength(1);
		expect(details.paths[0]).toMatch(/^M/);
		expect(details.paths[0].endsWith('Z')).toBe(true);

		const paths = $$('[data-part="segment-path"]');
		expect(paths).toHaveLength(1);
		expect(paths[0].getAttribute('d')).toBe(details.paths[0]);
		expect(paths[0].getAttribute('data-scope')).toBe('signature-pad');

		expect($<HTMLInputElement>('[data-part="hidden-input"]')!.value).toBe(details.paths[0]);
		expect($('[data-part="clear-trigger"]')!.hasAttribute('hidden')).toBe(false);
		expect($('[data-part="control"]')!.textContent).not.toContain('undefined');
	});

	test('ignores pointer downs that are not a plain left click', async () => {
		const onDrawEnd = vi.fn();
		render(Phase3SignaturePad, { props: { onDrawEnd } });

		const control = $('[data-part="control"]')!;
		await fireEvent.pointerDown(control, { clientX: 4, clientY: 4, pointerId: 1, button: 2 });
		await fireEvent.pointerMove(document, { clientX: 40, clientY: 40, pointerId: 1 });
		await fireEvent.pointerUp(document, { clientX: 40, clientY: 40, pointerId: 1 });

		expect(onDrawEnd).not.toHaveBeenCalled();
		expect($$('[data-part="segment-path"]')).toHaveLength(0);

		await fireEvent.pointerDown(control, { clientX: 4, clientY: 4, pointerId: 1, button: 0, ctrlKey: true });
		await fireEvent.pointerMove(document, { clientX: 40, clientY: 40, pointerId: 1 });
		await fireEvent.pointerUp(document, { clientX: 40, clientY: 40, pointerId: 1 });

		expect(onDrawEnd).not.toHaveBeenCalled();
	});

	test('the clear trigger empties the pad and refocuses the control', async () => {
		const onDrawEnd = vi.fn();
		render(Phase3SignaturePad, { props: { onDrawEnd } });

		const control = $('[data-part="control"]')!;
		mockRect(control);
		await draw(control);
		expect($$('[data-part="segment-path"]')).toHaveLength(1);

		await fireEvent.click($('[data-part="clear-trigger"]')!);

		expect($$('[data-part="segment-path"]')).toHaveLength(0);
		expect(onDrawEnd).toHaveBeenLastCalledWith(expect.objectContaining({ paths: [] }));
		expect($('[data-part="clear-trigger"]')!.hasAttribute('hidden')).toBe(true);
		expect($<HTMLInputElement>('[data-part="hidden-input"]')!.value).toBe('');
		expect(document.activeElement).toBe(control);
	});

	test('a read-only pad refuses strokes and hides the clear trigger', async () => {
		const onDrawEnd = vi.fn();
		render(Phase3SignaturePad, { props: { readOnly: true, paths: ['M0,0 Q1,1 2,2 Z'], onDrawEnd } });

		const control = $('[data-part="control"]')!;
		mockRect(control);
		await draw(control);

		expect(onDrawEnd).not.toHaveBeenCalled();
		expect($$('[data-part="segment-path"]')).toHaveLength(1);
		expect($('[data-part="clear-trigger"]')!.hasAttribute('hidden')).toBe(true);
	});

	test('a disabled pad leaves the control out of the tab order', () => {
		render(Phase3SignaturePad, { props: { disabled: true } });

		const control = $('[data-part="control"]')!;
		expect(control.hasAttribute('tabindex')).toBe(false);
		expect(control.getAttribute('aria-disabled')).toBe('true');
		expect(control.getAttribute('data-disabled')).toBe('');
		expect($('[data-part="guide"]')!.getAttribute('data-disabled')).toBe('');
		expect($('[data-part="root"]')!.getAttribute('data-disabled')).toBe('');
	});

	test('folds the surrounding field state into the pad', async () => {
		render(Phase3SignaturePadField, { props: { invalid: true, readOnly: true } });

		const control = $('[data-part="control"]')!;
		const describedBy = control.getAttribute('aria-describedby')?.split(' ') ?? [];
		const fieldId = $('[data-scope="field"][data-part="root"]')!.id;
		expect(describedBy).toContain(`${fieldId}::error-text`);
		expect(document.getElementById(describedBy[0])!.textContent).toBe('Signature is required');

		mockRect(control);
		await draw(control);
		expect($$('[data-part="segment-path"]')).toHaveLength(0);

		await fireEvent.click($('[data-part="clear-trigger"]')!);
		expect($$('[data-part="segment-path"]')).toHaveLength(0);
	});

	test('a field-disabled field does not disable the pad', () => {
		render(Phase3SignaturePadField, { props: { disabled: true } });

		// Ark folds only `field.readOnly` into the signature pad, so a disabled field leaves the
		// control interactive; the surrounding field still owns the aria wiring.
		expect($('[data-part="control"]')!.getAttribute('aria-disabled')).toBe('false');
		expect($('[data-scope="signature-pad"][data-part="root"]')!.getAttribute('data-disabled')).toBeNull();
	});

	test('the composite canvas part renders the same parts', () => {
		render(Phase3SignaturePad, { props: { composite: true } });

		const control = $('[data-part="control"]')!;
		expect(control.querySelector('[data-part="segment"]')).not.toBeNull();
		expect(control.querySelector('[data-part="guide"]')).not.toBeNull();
		expect(control.querySelector('[data-part="clear-trigger"]')).not.toBeNull();
		expect($('[data-part="segment"]')!.getAttribute('data-slot')).toBe('signature-pad-segment');
	});

	test('asChild keeps every hook on a custom clear trigger', async () => {
		render(Phase3SignaturePad, { props: { clearAsChild: true } });

		const custom = $<HTMLButtonElement>('[data-part="clear-trigger"]')!;
		expect(custom.textContent).toBe('reset');
		expect(custom.getAttribute('data-scope')).toBe('signature-pad');
		expect(custom.getAttribute('data-slot')).toBe('signature-pad-clear-trigger');
		expect(custom.getAttribute('aria-label')).toBe('clear signature');
		expect(custom.getAttribute('data-part')).toBe('clear-trigger');
		expect(document.querySelectorAll('[data-part="clear-trigger"]')).toHaveLength(1);
	});

	test('exports the drawing as an svg data url', async () => {
		const { findByTestId } = render(Phase3SignaturePadApi);

		const control = $('[data-part="control"]')!;
		mockRect(control);
		mockRect($('[data-part="segment"]')!);
		await draw(control);

		await findByTestId('export').then((button) => fireEvent.click(button));
		const url = (await findByTestId('data-url')).textContent!;

		expect(url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
		const svg = decodeURIComponent(url.slice('data:image/svg+xml;charset=utf-8,'.length));
		expect(svg).toContain('viewBox="0 0 200 100"');
		expect(svg).toContain('width="200"');
		expect(svg).toContain('<path');
		expect(decodeURIComponent(url)).toContain('Signature');
	});

	test('rasterizes to a png through the canvas', async () => {
		const { findByTestId } = render(Phase3SignaturePadApi);

		const control = $('[data-part="control"]')!;
		mockRect(control);
		mockRect($('[data-part="segment"]')!, 320, 160);
		await draw(control);

		await fireEvent.click(await findByTestId('export-png'));

		expect(drawImage).toHaveBeenCalledTimes(1);
		expect((await findByTestId('data-url')).textContent).toBe('data:image/png;base64,c2lnbmF0dXJl');

		const canvas = vi.mocked(HTMLCanvasElement.prototype.getContext).mock.instances.at(-1) as
			| HTMLCanvasElement
			| undefined;
		expect(canvas?.width).toBe(320);
		expect(canvas?.height).toBe(160);
	});

	test('an empty pad exports an empty string', async () => {
		const { findByTestId } = render(Phase3SignaturePadApi);

		await fireEvent.click(await findByTestId('export'));
		expect((await findByTestId('data-url')).textContent).toBe('');
	});

	test('the api clears and reports draws', async () => {
		const { findByTestId } = render(Phase3SignaturePadApi);

		const control = $('[data-part="control"]')!;
		mockRect(control);
		await draw(control);

		expect((await findByTestId('paths')).textContent).toMatch(/^M/);
		expect((await findByTestId('draws')).textContent).toBe('4');

		await fireEvent.click(await findByTestId('clear'));
		expect((await findByTestId('paths')).textContent).toBe('');
		expect($<HTMLInputElement>('[data-part="hidden-input"]')!.value).toBe('');
	});
});

describe('signature pad stroke geometry', () => {
	test('rejects degenerate strokes', () => {
		expect(getSvgPathFromStroke([])).toBe('');
		expect(getSvgPathFromStroke([[0, 0], [1, 1], [2, 2]])).toBe('');
		expect(getStroke([{ x: 0, y: 0 }])).toEqual([]);
	});

	test('serializes a closed ribbon with fixed precision', () => {
		const outline = getStroke(
			[
				{ x: 0, y: 0, pressure: 0.5 },
				{ x: 10, y: 0, pressure: 0.5 },
				{ x: 20, y: 0, pressure: 0.5 }
			],
			{ size: 4, thinning: 0, simulatePressure: false }
		);

		expect(outline).toHaveLength(6);
		const path = getSvgPathFromStroke(outline);
		expect(path.startsWith('M')).toBe(true);
		expect(path.endsWith('Z')).toBe(true);
		expect(path).toMatch(/^-?M-?\d+\.\d{2},-?\d+\.\d{2} Q/);
	});

	test('thinning narrows the ribbon for lighter pressure', () => {
		const heavy = getStroke(
			[
				{ x: 0, y: 0, pressure: 1 },
				{ x: 10, y: 0, pressure: 1 },
				{ x: 20, y: 0, pressure: 1 }
			],
			{ size: 10, thinning: 0.8, simulatePressure: false }
		);
		const light = getStroke(
			[
				{ x: 0, y: 0, pressure: 0.1 },
				{ x: 10, y: 0, pressure: 0.1 },
				{ x: 20, y: 0, pressure: 0.1 }
			],
			{ size: 10, thinning: 0.8, simulatePressure: false }
		);

		const width = (outline: number[][]) => Math.abs(outline[1][1] - outline[4][1]);
		expect(width(heavy)).toBeGreaterThan(width(light));
	});
});
