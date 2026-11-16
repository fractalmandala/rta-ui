import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase3Slider from './harness/Phase3Slider.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = <T extends Element = HTMLElement>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[];

const root = () => $('[data-scope="slider"][data-part="root"]')!;
const control = () => $('[data-scope="slider"][data-part="control"]')!;
const thumbs = () => $$('[data-scope="slider"][data-part="thumb"]');

const stubRect = (el: Element, rect: Partial<DOMRect>) => {
	el.getBoundingClientRect = () =>
		({
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			top: 0,
			left: 0,
			right: 100,
			bottom: 100,
			toJSON: () => ({}),
			...rect
		}) as DOMRect;
};

afterEach(() => {
	document.body.innerHTML = '';
});

describe('Slider', () => {
	test('renders every part with the moduix hooks', () => {
		render(Phase3Slider, { props: { defaultValue: [50] } });

		const rootEl = root();
		expect(rootEl.getAttribute('data-slot')).toBe('slider-root');
		expect(rootEl.getAttribute('data-orientation')).toBe('horizontal');
		expect(rootEl.hasAttribute('data-disabled')).toBe(false);
		expect(rootEl.hasAttribute('data-invalid')).toBe(false);
		expect(rootEl.hasAttribute('data-dragging')).toBe(false);
		expect(rootEl.id.startsWith('slider:')).toBe(true);

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('slider-label');
		expect(label.textContent).toBe('Volume');

		const valueText = $('[data-part="value-text"]')!;
		expect(valueText.getAttribute('data-slot')).toBe('slider-value-text');
		expect(valueText.textContent?.trim()).toBe('50');

		expect(control().getAttribute('data-slot')).toBe('slider-control');
		expect($('[data-part="track"]')!.getAttribute('data-slot')).toBe('slider-track');
		expect($('[data-part="range"]')!.getAttribute('data-slot')).toBe('slider-range');

		const thumb = thumbs()[0];
		expect(thumb.getAttribute('data-slot')).toBe('slider-thumb');
		expect(thumb.getAttribute('role')).toBe('slider');
		expect(thumb.getAttribute('data-index')).toBe('0');
		expect(thumb.getAttribute('tabindex')).toBe('0');
		expect(thumb.getAttribute('aria-valuemin')).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')).toBe('100');
		expect(thumb.getAttribute('aria-valuenow')).toBe('50');
		expect(thumb.hasAttribute('aria-valuetext')).toBe(false);
		expect(control().getAttribute('data-orientation')).toBe('horizontal');
	});

	test('places thumbs and the range through the root custom properties', () => {
		render(Phase3Slider, { props: { defaultValue: [25] } });

		const style = root().getAttribute('style') ?? '';
		expect(style).toContain('--slider-thumb-offset-0:');
		expect(style).toContain('--slider-thumb-width:');
		expect(style).toContain('--slider-range-start: 0%');
		expect(style).toContain('--slider-range-end: 75%');

		const rangeStyle = $('[data-part="range"]')!.getAttribute('style') ?? '';
		expect(rangeStyle).toContain('left: var(--slider-range-start)');
		expect(rangeStyle).toContain('right: var(--slider-range-end)');
	});

	test('formats the thumb value through getAriaValueText', () => {
		render(Phase3Slider, {
			props: {
				defaultValue: [40],
				getAriaValueText: ({ value }) => `${value} percent`
			}
		});

		expect(thumbs()[0].getAttribute('aria-valuetext')).toBe('40 percent');
	});

	test('renders a marker group with per-marker state', () => {
		render(Phase3Slider, { props: { defaultValue: [50], markers: true } });

		const group = $('[data-part="marker-group"]')!;
		expect(group.getAttribute('data-slot')).toBe('slider-marker-group');
		expect(group.getAttribute('role')).toBe('presentation');

		const markers = $$('[data-part="marker"]');
		expect(markers).toHaveLength(3);
		expect(markers[0].getAttribute('data-slot')).toBe('slider-marker');
		expect(markers.map((marker) => marker.getAttribute('data-state'))).toEqual([
			'under-value',
			'at-value',
			'over-value'
		]);
	});

	test('exposes one hidden input per thumb', () => {
		render(Phase3Slider, { props: { defaultValue: [20, 80], thumbs: 2, hiddenInput: true } });

		const inputs = $$<HTMLInputElement>('[data-part="hidden-input"]');
		expect(inputs).toHaveLength(2);
		expect(inputs.map((input) => input.value)).toEqual(['20', '80']);
		expect(inputs[0].type).toBe('text');
		expect(inputs[0].hidden).toBe(true);
		expect(inputs[0].name).toBe('volume[]');
	});

	test('arrow, page, home and end keys step the focused thumb', async () => {
		const onValueChange = vi.fn();
		const onValueChangeEnd = vi.fn();
		render(Phase3Slider, {
			props: { defaultValue: [50], step: 2, onValueChange, onValueChangeEnd }
		});

		const thumb = thumbs()[0];
		thumb.focus();

		await fireEvent.keyDown(thumb, { key: 'ArrowRight' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [52] });
		expect(thumb.getAttribute('aria-valuenow')).toBe('52');

		await fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [50] });

		await fireEvent.keyDown(thumb, { key: 'PageUp' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [80] });

		await fireEvent.keyDown(thumb, { key: 'End' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [100] });

		await fireEvent.keyDown(thumb, { key: 'Home' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [0] });

		expect(onValueChangeEnd).toHaveBeenCalledTimes(5);
		expect(onValueChangeEnd).toHaveBeenLastCalledWith({ value: [0] });
	});

	test('dragging the control moves the closest thumb', async () => {
		const onValueChange = vi.fn();
		const onValueChangeEnd = vi.fn();
		render(Phase3Slider, { props: { defaultValue: [50], onValueChange, onValueChangeEnd } });

		stubRect(control(), { width: 200, height: 200, right: 200, bottom: 200 });

		await fireEvent.pointerDown(control(), { clientX: 50, clientY: 100, button: 0 });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [25] });
		expect(root().hasAttribute('data-dragging')).toBe(true);

		await fireEvent.pointerMove(control(), { clientX: 150, clientY: 100 });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [75] });

		await fireEvent.pointerUp(control(), { clientX: 150, clientY: 100 });
		expect(root().hasAttribute('data-dragging')).toBe(false);
		expect(onValueChangeEnd).toHaveBeenLastCalledWith({ value: [75] });
	});

	test('vertical orientation maps the pointer position to the height', async () => {
		render(Phase3Slider, { props: { defaultValue: [50], orientation: 'vertical' } });

		expect(root().getAttribute('data-orientation')).toBe('vertical');
		stubRect(control(), { width: 20, height: 200, right: 20, bottom: 200 });

		await fireEvent.pointerDown(control(), { clientX: 10, clientY: 100, button: 0 });
		expect(thumbs()[0].getAttribute('aria-valuenow')).toBe('50');

		await fireEvent.pointerDown(control(), { clientX: 10, clientY: 0, button: 0 });
		expect(thumbs()[0].getAttribute('aria-valuenow')).toBe('100');
	});

	test('two thumbs stay ordered with the none collision behaviour', async () => {
		const onValueChange = vi.fn();
		render(Phase3Slider, {
			props: { defaultValue: [20, 60], thumbs: 2, onValueChange }
		});
		stubRect(control(), { width: 100, height: 100 });

		await fireEvent.pointerDown(thumbs()[0], { clientX: 0, clientY: 0, button: 0 });
		await fireEvent.pointerMove(control(), { clientX: 90, clientY: 50 });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [60, 60] });
	});

	test('the swap collision behaviour exchanges the crossed thumbs', async () => {
		const onValueChange = vi.fn();
		render(Phase3Slider, {
			props: { defaultValue: [20, 60], thumbs: 2, collision: 'swap', onValueChange }
		});
		stubRect(control(), { width: 100, height: 100 });

		await fireEvent.pointerDown(thumbs()[0], { clientX: 0, clientY: 0, button: 0 });
		await fireEvent.pointerMove(control(), { clientX: 90, clientY: 50 });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: [60, 90] });
	});

	test('a disabled slider ignores pointer and keyboard input', async () => {
		const onValueChange = vi.fn();
		render(Phase3Slider, { props: { defaultValue: [50], disabled: true, onValueChange } });

		expect(root().hasAttribute('data-disabled')).toBe(true);
		expect(thumbs()[0].hasAttribute('data-disabled')).toBe(true);
		expect(thumbs()[0].getAttribute('tabindex')).toBeNull();
		expect(thumbs()[0].getAttribute('aria-disabled')).toBe('true');

		await fireEvent.keyDown(thumbs()[0], { key: 'ArrowRight' });
		await fireEvent.pointerDown(control(), { clientX: 90, clientY: 50, button: 0 });
		expect(onValueChange).not.toHaveBeenCalled();
	});
});
