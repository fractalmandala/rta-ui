import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase3AngleSlider from './harness/Phase3AngleSlider.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = <T extends Element = HTMLElement>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[];

const root = () => $('[data-scope="angle-slider"][data-part="root"]')!;
const control = () => $('[data-scope="angle-slider"][data-part="control"]')!;
const thumb = () => $('[data-scope="angle-slider"][data-part="thumb"]')!;

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

describe('AngleSlider', () => {
	test('renders every part with the moduix hooks', () => {
		render(Phase3AngleSlider, { props: { defaultValue: 45, hiddenInput: true } });

		const rootEl = root();
		expect(rootEl.getAttribute('data-slot')).toBe('angle-slider-root');
		expect(rootEl.hasAttribute('data-disabled')).toBe(false);
		expect(rootEl.hasAttribute('data-invalid')).toBe(false);
		expect(rootEl.hasAttribute('data-readonly')).toBe(false);
		expect(rootEl.id.startsWith('angle-slider:')).toBe(true);
		expect(rootEl.getAttribute('style')).toContain('--value: 45');
		expect(rootEl.getAttribute('style')).toContain('--angle: 45deg');

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('angle-slider-label');
		expect(label.textContent).toBe('Rotation');
		expect(label.getAttribute('for')).toBe($('[data-part="hidden-input"]')!.id);

		const controlEl = control();
		expect(controlEl.getAttribute('data-slot')).toBe('angle-slider-control');
		expect(controlEl.getAttribute('role')).toBe('presentation');

		const thumbEl = thumb();
		expect(thumbEl.getAttribute('data-slot')).toBe('angle-slider-thumb');
		expect(thumbEl.getAttribute('role')).toBe('slider');
		expect(thumbEl.getAttribute('tabindex')).toBe('0');
		expect(thumbEl.getAttribute('aria-valuemin')).toBe('0');
		expect(thumbEl.getAttribute('aria-valuemax')).toBe('360');
		expect(thumbEl.getAttribute('aria-valuenow')).toBe('45');
			expect(thumbEl.getAttribute('style')).toContain('rotate: var(--angle)');

		const valueText = $('[data-part="value-text"]')!;
		expect(valueText.getAttribute('data-slot')).toBe('angle-slider-value-text');
		expect(valueText.textContent?.trim()).toBe('45deg');

		const input = $<HTMLInputElement>('[data-part="hidden-input"]')!;
		expect(input.type).toBe('hidden');
		expect(input.value).toBe('45');
		expect(input.name).toBe('angle');
	});

	test('the dial composition nests the value text and thumb in the control', () => {
		render(Phase3AngleSlider, { props: { defaultValue: 90, dial: true } });

		const controlEl = control();
		expect(controlEl.querySelector('[data-part="value-text"]')).toBeTruthy();
		expect(controlEl.querySelector('[data-part="thumb"]')).toBeTruthy();
	});

	test('marks report their state relative to the value', () => {
		render(Phase3AngleSlider, { props: { defaultValue: 90, marks: true } });

		const markers = $$('[data-part="marker"]');
		expect(markers).toHaveLength(4);
		expect(markers.map((marker) => marker.getAttribute('data-value'))).toEqual([
			'0',
			'90',
			'180',
			'270'
		]);
		expect(markers.map((marker) => marker.getAttribute('data-state'))).toEqual([
			'under-value',
			'at-value',
			'over-value',
			'over-value'
		]);
		expect(markers[1].getAttribute('style')).toContain('--marker-display-value: 90');
	});

	test('arrow, home and end keys step the value', async () => {
		const onValueChange = vi.fn();
		const onValueChangeEnd = vi.fn();
		render(Phase3AngleSlider, {
			props: { defaultValue: 10, step: 5, onValueChange, onValueChangeEnd }
		});

		const thumbEl = thumb();
		thumbEl.focus();

		await fireEvent.keyDown(thumbEl, { key: 'ArrowRight' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 15, valueAsDegree: '15deg' });
		expect(thumbEl.getAttribute('aria-valuenow')).toBe('15');

		await fireEvent.keyDown(thumbEl, { key: 'ArrowUp' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 10, valueAsDegree: '10deg' });

		await fireEvent.keyDown(thumbEl, { key: 'ArrowDown' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 15, valueAsDegree: '15deg' });

		await fireEvent.keyDown(thumbEl, { key: 'End' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 359, valueAsDegree: '359deg' });

		await fireEvent.keyDown(thumbEl, { key: 'Home' });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 0, valueAsDegree: '0deg' });

		expect(onValueChangeEnd).toHaveBeenCalledTimes(5);
	});

	test('pressing the control sets the value from the pointer angle', async () => {
		const onValueChange = vi.fn();
		const onValueChangeEnd = vi.fn();
		render(Phase3AngleSlider, { props: { onValueChange, onValueChangeEnd } });

		stubRect(control(), { width: 100, height: 100 });

		// Right of the centre is 90deg, below it is 180deg.
		await fireEvent.pointerDown(control(), { clientX: 100, clientY: 50, button: 0 });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 90, valueAsDegree: '90deg' });

		await fireEvent.pointerMove(control(), { clientX: 50, clientY: 100 });
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 180, valueAsDegree: '180deg' });

		await fireEvent.pointerUp(control(), { clientX: 50, clientY: 100 });
		expect(onValueChangeEnd).toHaveBeenLastCalledWith({ value: 180, valueAsDegree: '180deg' });
	});

	test('the value is clamped to the 0-359 degree range', async () => {
		render(Phase3AngleSlider, { props: { defaultValue: 359 } });

		const thumbEl = thumb();
		thumbEl.focus();

		await fireEvent.keyDown(thumbEl, { key: 'ArrowRight' });
		expect(thumbEl.getAttribute('aria-valuenow')).toBe('359');
	});

	test('a read-only slider keeps its value', async () => {
		const onValueChange = vi.fn();
		render(Phase3AngleSlider, {
			props: { defaultValue: 45, readOnly: true, onValueChange }
		});

		expect(root().hasAttribute('data-readonly')).toBe(true);
		expect(thumb().getAttribute('data-readonly')).toBe('');

		await fireEvent.keyDown(thumb(), { key: 'ArrowRight' });
		await fireEvent.pointerDown(control(), { clientX: 100, clientY: 50, button: 0 });
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test('a disabled slider is not reachable by keyboard', () => {
		render(Phase3AngleSlider, { props: { defaultValue: 45, disabled: true } });

		expect(root().hasAttribute('data-disabled')).toBe(true);
		expect(thumb().getAttribute('tabindex')).toBeNull();
		expect(thumb().hasAttribute('aria-disabled')).toBe(false);
	});
});
