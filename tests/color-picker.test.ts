import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase6ColorPicker from './harness/Phase6ColorPicker.svelte';
import Phase6ColorPickerProvider from './harness/Phase6ColorPickerProvider.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = <T extends Element = HTMLElement>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[];

const part = (name: string) => $(`[data-scope="color-picker"][data-part="${name}"]`);
const parts = (name: string) => $$(`[data-scope="color-picker"][data-part="${name}"]`);
const channelSlider = (channel: string) =>
	$(`[data-part="channel-slider"][data-channel="${channel}"]`);
const channelThumb = (channel: string) =>
	$(`[data-part="channel-slider-thumb"][data-channel="${channel}"]`);
const hexInput = () => $<HTMLInputElement>('[data-part="channel-input"][data-channel="hex"]')!;

const pointer = (target: EventTarget, type: string, init: MouseEventInit) => {
	target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, ...init }));
};

const stubRect = (element: Element, rect: Partial<DOMRect>) => {
	element.getBoundingClientRect = () =>
		({
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			top: 0,
			left: 0,
			right: 200,
			bottom: 100,
			toJSON: () => ({}),
			...rect
		}) as DOMRect;
};

const percentageIn = (style: string, property: string) => {
	const match = new RegExp(`${property}: ([-\\d.]+)%`).exec(style);
	return match ? Number(match[1]) : Number.NaN;
};

afterEach(() => {
	document.body.innerHTML = '';
});

describe('ColorPicker', () => {
	test('renders the Zag ids, hooks and inline styles for every part', () => {
		render(Phase6ColorPicker, { props: { inline: true } });

		const root = part('root')!;
		const id = root.id.replace('color-picker:', '');
		expect(root.getAttribute('data-slot')).toBe('color-picker-root');
		expect(root.getAttribute('style')).toContain('--value: rgba(235, 94, 65, 1)');
		expect(root.hasAttribute('data-disabled')).toBe(false);

		const label = part('label')!;
		expect(label.getAttribute('for')).toBe(`color-picker:${id}:hidden-input`);
		expect(label.getAttribute('data-slot')).toBe('color-picker-label');

		const control = part('control')!;
		expect(control.getAttribute('data-state')).toBe('open');
		expect(control.getAttribute('data-slot')).toBe('color-picker-control');

		const trigger = part('trigger')!;
		expect(trigger.getAttribute('aria-haspopup')).toBeNull();
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		expect(trigger.getAttribute('aria-label')).toContain('rgba(235, 94, 65, 1)');
		expect(trigger.getAttribute('aria-controls')).toBe(`color-picker:${id}:content`);
		expect(trigger.getAttribute('aria-labelledby')).toBe(`color-picker:${id}:label`);

		const valueSwatch = $('[data-slot="color-picker-value-swatch"]')!;
		expect(valueSwatch.getAttribute('data-part')).toBe('swatch');
		// jsdom re-serialises the style attribute, so the colour reads back in its normalised form.
		expect(valueSwatch.getAttribute('style')).toContain('--color: rgba(235, 94, 65, 1)');

		const content = part('content')!;
		expect(content.id).toBe(`color-picker:${id}:content`);
		expect(content.hasAttribute('role')).toBe(false);
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.hidden).toBe(false);

		const area = part('area')!;
		expect(area.getAttribute('role')).toBe('group');
		expect(area.id).toBe(`color-picker:${id}:area`);

		const background = part('area-background')!;
		expect(background.id).toBe(`color-picker:${id}:area-gradient`);
		const backgroundStyle = background.getAttribute('style') ?? '';
		expect(backgroundStyle).toContain('background: linear-gradient(to top,');
		expect(backgroundStyle).toContain('linear-gradient(to right, rgb(255, 255, 255)');
		expect(backgroundStyle).toContain('rgb(255, 44, 0)');

		const thumb = part('area-thumb')!;
		expect(thumb.getAttribute('role')).toBe('slider');
		expect(thumb.getAttribute('aria-roledescription')).toBe('2d slider');
		expect(thumb.getAttribute('aria-label')).toBe('saturation and brightness');
		expect(thumb.getAttribute('aria-valuenow')).toBe('72.34');
		expect(thumb.getAttribute('tabindex')).toBe('0');
		const thumbStyle = thumb.getAttribute('style') ?? '';
		expect(percentageIn(thumbStyle, 'left')).toBeCloseTo(72.34, 1);
		expect(percentageIn(thumbStyle, 'top')).toBeCloseTo(7.84, 1);
		expect(thumbStyle).toContain('--color: hsla(10.24, 80.96%, 58.83%, 1)');

		const hueTrack = $('[data-part="channel-slider-track"][data-channel="hue"]')!;
		expect(hueTrack.id).toBe(`color-picker:${id}:slider-track:hue`);
		expect(hueTrack.getAttribute('role')).toBe('group');
		expect(hueTrack.getAttribute('style')).toContain('background-image: linear-gradient(to right');

		const hueThumb = channelThumb('hue')!;
		expect(hueThumb.getAttribute('role')).toBe('slider');
		expect(hueThumb.getAttribute('aria-valuemin')).toBe('0');
		expect(hueThumb.getAttribute('aria-valuemax')).toBe('360');
		expect(Number(hueThumb.getAttribute('aria-valuenow'))).toBeCloseTo(10.24, 1);
		expect(hueThumb.getAttribute('style')).toContain('position: absolute');
		expect(percentageIn(hueThumb.getAttribute('style') ?? '', 'left')).toBeCloseTo(2.84, 1);

		const gridStyle = $('[data-part="transparency-grid"]')!.getAttribute('style') ?? '';
		expect(gridStyle).toContain('--size: 12px');
		expect(gridStyle).toContain('pointer-events: none');

		const hidden = $<HTMLInputElement>('input[tabindex="-1"]')!;
		expect(hidden.name).toBe('accent');
		expect(hidden.value).toBe('rgba(235, 94, 65, 1)');
		expect(hidden.getAttribute('style')).toMatch(/position:\s*absolute/);

		expect(part('value-text')!.textContent?.trim()).toBe('rgba(235, 94, 65, 1)');
	});

	test('converts a pointer position in the area into channel values', async () => {
		const onValueChange = vi.fn();
		const onValueChangeEnd = vi.fn();
		render(Phase6ColorPicker, { props: { inline: true, onValueChange, onValueChangeEnd } });

		const area = part('area')!;
		stubRect(area, { width: 200, height: 100 });

		pointer(area, 'pointerdown', { button: 0, clientX: 100, clientY: 50 });
		await tick();

		expect(onValueChange).toHaveBeenCalled();
		expect(onValueChange.mock.calls.at(-1)?.[0].value).toBe('rgba(128, 75, 64, 1)');
		const thumb = part('area-thumb')!;
		expect(thumb.getAttribute('aria-valuenow')).toBe('50');
		expect(thumb.getAttribute('aria-valuetext')).toContain('saturation 50');
		expect(part('area-thumb')!.getAttribute('data-part')).toBe('area-thumb');

		pointer(document, 'pointermove', { clientX: 200, clientY: 0 });
		await tick();

		expect(onValueChange.mock.calls.at(-1)?.[0].value).toBe('rgba(255, 44, 0, 1)');
		expect(onValueChangeEnd).not.toHaveBeenCalled();

		pointer(document, 'pointerup', { clientX: 200, clientY: 0 });
		await tick();
		expect(onValueChangeEnd).toHaveBeenCalledTimes(1);
	});

	test('steps the hue slider with the keyboard', async () => {
		const onValueChange = vi.fn();
		render(Phase6ColorPicker, { props: { inline: true, onValueChange } });

		const hueThumb = channelThumb('hue')!;
		const before = Number(hueThumb.getAttribute('aria-valuenow'));

		await fireEvent.keyDown(hueThumb, { key: 'ArrowRight' });
		await tick();

		expect(onValueChange).toHaveBeenCalledTimes(1);
		const after = Number(channelThumb('hue')!.getAttribute('aria-valuenow'));
		expect(after).toBeGreaterThan(before);
		expect(after).toBeLessThan(before + 1.5);

		await fireEvent.keyDown(channelThumb('hue')!, { key: 'Home' });
		await tick();
		expect(channelThumb('hue')!.getAttribute('aria-valuenow')).toBe('0');
	});

	test('commits typed channel input into the hidden form field', async () => {
		const onValueChangeEnd = vi.fn();
		render(Phase6ColorPicker, { props: { inline: true, onValueChangeEnd } });

		const input = hexInput();
		input.value = '#16a34a';
		await fireEvent.keyDown(input, { key: 'Enter' });
		await tick();

		const hidden = $<HTMLInputElement>('input[tabindex="-1"]')!;
		expect(hidden.value).toBe('rgba(22, 163, 74, 1)');
		const form = hidden.closest('form')!;
		expect(new FormData(form).get('accent')).toBe('rgba(22, 163, 74, 1)');
		expect(onValueChangeEnd).toHaveBeenCalledWith({
			value: 'rgba(22, 163, 74, 1)',
			valueAsString: 'rgba(22, 163, 74, 1)'
		});
		expect(hexInput().value).toBe('#16A34A');
	});

	test('selects a swatch and closes the portalled popup when closeOnSelect is set', async () => {
		render(Phase6ColorPicker, { props: { defaultOpen: true, closeOnSelect: true } });

		await waitFor(() => expect(part('content')).not.toBeNull());
		expect(part('content')!.closest('[data-rta-portal]')).toBeTruthy();
		expect(part('content')!.getAttribute('role')).toBe('dialog');

		const swatches = parts('swatch-trigger');
		expect(swatches).toHaveLength(3);
		expect(swatches[1].getAttribute('data-value')).toBe('#2563EB');
		expect(swatches[1].getAttribute('data-state')).toBe('unchecked');
		expect(swatches[1].getAttribute('aria-label')).toBe('select #2563EB as the color');

		await fireEvent.click(swatches[1]);
		await tick();

		expect($<HTMLInputElement>('input[tabindex="-1"]')!.value).toBe('rgba(37, 99, 235, 1)');
		expect(part('trigger')!.getAttribute('data-state')).toBe('closed');

		await waitFor(() => expect(part('content')).toBeNull());
	});

	test('switches format through the select and shows the matching view', async () => {
		const onFormatChange = vi.fn();
		render(Phase6ColorPicker, { props: { inline: true, onFormatChange } });

		const select = part('format-select') as HTMLSelectElement;
		expect(select.value).toBe('rgba');
		expect(Array.from(select.options).map((option) => option.value)).toEqual([
			'rgba',
			'hsla',
			'hsba'
		]);

		await fireEvent.change(select, { target: { value: 'hsla' } });
		await tick();

		expect(onFormatChange).toHaveBeenCalledWith({ format: 'hsla' });
		expect((part('format-select') as HTMLSelectElement).value).toBe('hsla');
		expect(part('value-text')!.textContent?.trim()).toMatch(/^hsla\(/);
		expect($('[data-part="view"][data-format="hsla"]')).toBeTruthy();
		expect($('[data-part="view"][data-format="rgba"]')).toBeNull();
		expect(part('area-thumb')!.getAttribute('aria-label')).toBe('saturation and lightness');
	});

	test('exposes the disabled and read-only state hooks', () => {
		render(Phase6ColorPicker, { props: { inline: true, disabled: true } });

		expect(part('root')!.hasAttribute('data-disabled')).toBe(true);
		expect(part('trigger')!.hasAttribute('disabled')).toBe(true);
		expect(part('area-thumb')!.hasAttribute('tabindex')).toBe(false);
		expect(part('area-thumb')!.getAttribute('aria-disabled')).toBe('true');
		expect(channelThumb('hue')!.getAttribute('aria-disabled')).toBe('true');
	});

	test('shares state created outside the tree through the root provider', async () => {
		render(Phase6ColorPickerProvider, { props: {} });

		const root = document.querySelector('[data-slot="color-picker-root-provider"]')!;
		expect(root.id).toBe('color-picker:provider');
		expect(root.getAttribute('data-part')).toBe('root');
		expect(root.getAttribute('style')).toContain('--value: rgba(235, 94, 65, 1)');

		const hidden = $<HTMLInputElement>('input[tabindex="-1"]')!;
		expect(hidden.name).toBe('provider-color');
		expect(hidden.value).toBe('rgba(235, 94, 65, 1)');
		expect(part('area-thumb')!.id).toBe('color-picker:provider:area-thumb');

		await fireEvent.keyDown(channelThumb('hue')!, { key: 'ArrowRight' });
		await tick();

		expect($<HTMLInputElement>('input[tabindex="-1"]')!.value).toMatch(/^rgba\(/);
		expect(part('value-text')!.textContent?.trim()).toMatch(/^rgba\(/);
	});
});
