import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase3NumberInput from './harness/Phase3NumberInput.svelte';
import Phase3NumberInputProvider from './harness/Phase3NumberInputProvider.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const $$ = (selector: string) => Array.from(document.querySelectorAll(selector)) as HTMLElement[];

const input = () => $('[data-part="input"]') as HTMLInputElement;
const root = () => $('[data-part="root"]')!;
const incrementTrigger = () => $('[data-part="increment-trigger"]') as HTMLButtonElement;
const decrementTrigger = () => $('[data-part="decrement-trigger"]') as HTMLButtonElement;

const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 20));

afterEach(() => {
	vi.useRealTimers();
	document.body.innerHTML = '';
});

describe('NumberInput', () => {
	test('renders every part with the moduix hooks and the Zag id set', () => {
		render(Phase3NumberInput, { props: { value: '5', min: 0, max: 10, scrubber: true, valueText: true } });

		const rootEl = root();
		expect(rootEl.getAttribute('data-slot')).toBe('number-input-root');
		expect(rootEl.getAttribute('data-scope')).toBe('number-input');
		expect(rootEl.getAttribute('dir')).toBe('ltr');
		expect(rootEl.getAttribute('data-size')).toBe('md');
		expect(rootEl.hasAttribute('data-disabled')).toBe(false);
		expect(rootEl.hasAttribute('data-invalid')).toBe(false);
		expect(rootEl.hasAttribute('data-focus')).toBe(false);
		expect(rootEl.id.startsWith('number-input:')).toBe(true);

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('number-input-label');
		expect(label.textContent).toBe('Quantity');

		const control = $('[data-part="control"]')!;
		expect(control.getAttribute('data-slot')).toBe('number-input-control');
		expect(control.getAttribute('role')).toBe('group');
		expect(control.getAttribute('aria-disabled')).toBe('false');

		const field = input();
		expect(field.getAttribute('data-slot')).toBe('number-input-input');
		expect(field.id).toBe(`${rootEl.id}:input`);
		expect(label.getAttribute('for')).toBe(field.id);
		expect(field.getAttribute('role')).toBe('spinbutton');
		expect(field.getAttribute('type')).toBe('text');
		expect(field.getAttribute('inputmode')).toBe('decimal');
		expect(field.getAttribute('name')).toBe('quantity');
		expect(field.getAttribute('aria-roledescription')).toBe('numberfield');
		expect(field.getAttribute('aria-valuemin')).toBe('0');
		expect(field.getAttribute('aria-valuemax')).toBe('10');
		expect(field.getAttribute('aria-valuenow')).toBe('5');
		expect(field.getAttribute('pattern')).toBe('-?[0-9]*(.[0-9]+)?');
		expect(field.getAttribute('autocomplete')).toBe('off');
		expect(field.getAttribute('spellcheck')).toBe('false');
		expect(field.value).toBe('5');

		const inc = incrementTrigger();
		const dec = decrementTrigger();
		expect(inc.getAttribute('data-slot')).toBe('number-input-increment-trigger');
		expect(dec.getAttribute('data-slot')).toBe('number-input-decrement-trigger');
		expect(inc.id).toBe(`${rootEl.id}:inc`);
		expect(dec.id).toBe(`${rootEl.id}:dec`);
		expect(inc.getAttribute('type')).toBe('button');
		expect(inc.getAttribute('tabindex')).toBe('-1');
		expect(inc.getAttribute('aria-controls')).toBe(field.id);
		expect(inc.getAttribute('aria-label')).toBe('increment value');
		expect(dec.getAttribute('aria-label')).toBe('decrease value');

		const scrubber = $('[data-part="scrubber"]')!;
		expect(scrubber.getAttribute('data-slot')).toBe('number-input-scrubber');
		expect(scrubber.id).toBe(`${rootEl.id}:scrubber`);
		expect(scrubber.getAttribute('role')).toBe('presentation');
		expect(scrubber.style.cursor).toBe('ew-resize');

		const text = $('[data-part="value-text"]')!;
		expect(text.getAttribute('data-slot')).toBe('number-input-value-text');
		expect(text.textContent).toBe('5');
	});

	test('renders through the root provider', () => {
		render(Phase3NumberInputProvider, { props: { initial: '3', size: 'sm' } });

		const provider = $('[data-part="root-provider"]')!;
		expect(provider.getAttribute('data-slot')).toBe('number-input-root-provider');
		expect(provider.getAttribute('data-size')).toBe('sm');
		expect(provider.id.startsWith('number-input:')).toBe(true);
		expect(input().value).toBe('3');
		expect(input().id).toBe(`${provider.id}:input`);
	});

	test('keeps the raw value while typing and formats on blur', async () => {
		const onValueChange = vi.fn();
		render(Phase3NumberInput, {
			props: { defaultValue: '0.5', formatOptions: { minimumFractionDigits: 1 }, onValueChange }
		});

		const field = input();
		expect(field.value).toBe('0.5');

		await fireEvent.input(field, { target: { value: '75' } });
		expect(field.value).toBe('75');
		expect(onValueChange).toHaveBeenLastCalledWith({ value: '75', valueAsNumber: 75 });

		await fireEvent.blur(field);
		expect(field.value).toBe('75.0');
		expect(onValueChange).toHaveBeenLastCalledWith({ value: '75.0', valueAsNumber: 75 });
	});

	test('formats percent values from the display string', () => {
		render(Phase3NumberInput, { props: { defaultValue: '50%', formatOptions: { style: 'percent' } } });
		expect(input().value).toBe('50%');
	});

	test('formats with the locale and compares typed text in range', async () => {
		render(Phase3NumberInput, {
			props: { defaultValue: '1.234,5', locale: 'de-DE', formatOptions: { minimumFractionDigits: 1 } }
		});

		const field = input();
		expect(field.value).toBe('1.234,5');

		await fireEvent.input(field, { target: { value: '12,5' } });
		await fireEvent.blur(field);
		expect(field.value).toBe('12,5');
		expect(root().hasAttribute('data-invalid')).toBe(false);
	});

	test('marks invalid while out of range and clamps on blur', async () => {
		render(Phase3NumberInput, { props: { min: 0, max: 10, defaultValue: '5' } });

		const field = input();
		await fireEvent.input(field, { target: { value: '50' } });

		expect(root().hasAttribute('data-invalid')).toBe(true);
		expect(field.getAttribute('aria-invalid')).toBe('true');
		expect(field.getAttribute('aria-valuenow')).toBe('50');

		await fireEvent.blur(field);
		expect(root().hasAttribute('data-invalid')).toBe(false);
		expect(field.value).toBe('10');
		expect(field.getAttribute('aria-valuenow')).toBe('10');
	});

	test('reports the invalid reason when overflow is allowed', async () => {
		const onValueInvalid = vi.fn();
		render(Phase3NumberInput, {
			props: { min: 0, max: 10, allowOverflow: true, onValueInvalid, defaultValue: '5' }
		});

		const field = input();
		await fireEvent.input(field, { target: { value: '50' } });
		await fireEvent.blur(field);

		expect(onValueInvalid).toHaveBeenCalledWith({
			reason: 'rangeOverflow',
			value: '50',
			valueAsNumber: 50
		});
		expect(root().hasAttribute('data-invalid')).toBe(true);
	});

	test('steps with the keyboard, including large and small steps', async () => {
		render(Phase3NumberInput, { props: { min: 0, max: 100, step: 1, defaultValue: '5' } });

		const field = input();
		await fireEvent.focus(field);
		expect(root().hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(field, { key: 'ArrowUp' });
		expect(field.value).toBe('6');

		await fireEvent.keyDown(field, { key: 'ArrowUp', shiftKey: true });
		expect(field.value).toBe('16');

		await fireEvent.keyDown(field, { key: 'ArrowUp', altKey: true });
		expect(field.value).toBe('16.1');

		await fireEvent.keyDown(field, { key: 'PageUp' });
		expect(field.value).toBe('26.1');

		await fireEvent.keyDown(field, { key: 'ArrowDown' });
		expect(field.value).toBe('25.1');

		await fireEvent.keyDown(field, { key: 'Home' });
		expect(field.value).toBe('0');
		expect(decrementTrigger().disabled).toBe(true);

		await fireEvent.keyDown(field, { key: 'End' });
		expect(field.value).toBe('100');
		expect(incrementTrigger().disabled).toBe(true);

		await fireEvent.blur(field);
		expect(root().hasAttribute('data-focus')).toBe(false);
	});

	test('clamps stepped values and honours custom large and small steps', async () => {
		render(Phase3NumberInput, {
			props: { min: 0, max: 10, step: 2, largeStep: 5, smallStep: 0.5, defaultValue: '9' }
		});

		const field = input();
		await fireEvent.focus(field);
		await fireEvent.keyDown(field, { key: 'ArrowUp' });
		expect(field.value).toBe('10');

		await fireEvent.keyDown(field, { key: 'ArrowDown', shiftKey: true });
		expect(field.value).toBe('5');

		await fireEvent.keyDown(field, { key: 'ArrowUp', altKey: true });
		expect(field.value).toBe('5.5');
	});

	test('increments on trigger press and repeats while held', async () => {
		vi.useFakeTimers();
		render(Phase3NumberInput, { props: { defaultValue: '5', min: 0, max: 100, step: 1 } });

		const field = input();
		await fireEvent.pointerDown(incrementTrigger(), { button: 0, pointerType: 'mouse' });
		expect(field.value).toBe('6');

		await vi.advanceTimersByTimeAsync(320);
		await vi.advanceTimersByTimeAsync(50);
		expect(field.value).toBe('7');

		await fireEvent.pointerUp(incrementTrigger());
		await vi.advanceTimersByTimeAsync(200);
		expect(field.value).toBe('7');

		await fireEvent.pointerDown(decrementTrigger(), { button: 0, pointerType: 'mouse' });
		expect(field.value).toBe('6');
		await fireEvent.pointerUp(decrementTrigger());
	});

	test('spins with the mouse wheel only when it is allowed and focused', async () => {
		const { unmount } = render(Phase3NumberInput, { props: { defaultValue: '5' } });
		const field = input();
		await fireEvent.focus(field);
		await fireEvent.wheel(field, { deltaY: -1 });
		expect(field.value).toBe('5');
		unmount();

		render(Phase3NumberInput, { props: { defaultValue: '5', allowMouseWheel: true } });
		const allowed = input();
		await fireEvent.wheel(allowed, { deltaY: -1 });
		expect(allowed.value).toBe('5');

		await fireEvent.focus(allowed);
		await fireEvent.wheel(allowed, { deltaY: -1 });
		expect(allowed.value).toBe('6');
		await fireEvent.wheel(allowed, { deltaY: 1 });
		expect(allowed.value).toBe('5');
	});

	test('scrubs while dragging and cleans up the virtual cursor', async () => {
		const scrubEvent = (
			type: string,
			init: MouseEventInit & { movementX?: number; movementY?: number } = {}
		) => {
			const event = new MouseEvent(type, { bubbles: true, cancelable: true, ...init });
			if (init.movementX !== undefined) {
				Object.defineProperty(event, 'movementX', { value: init.movementX });
			}
			if (init.movementY !== undefined) {
				Object.defineProperty(event, 'movementY', { value: init.movementY });
			}
			return event;
		};

		render(Phase3NumberInput, { props: { defaultValue: '5', min: 0, max: 100, scrubber: true } });

		const scrubber = $('[data-part="scrubber"]')!;
		const field = input();
		const cursorId = `${root().id}:cursor`;

		await fireEvent(scrubber, scrubEvent('mousedown', { button: 0, clientX: 100, clientY: 100 }));
		expect(field.value).toBe('5');
		expect(root().hasAttribute('data-scrubbing')).toBe(true);
		expect(scrubber.hasAttribute('data-scrubbing')).toBe(true);
		expect(document.getElementById(cursorId)).not.toBeNull();

		await fireEvent(document, scrubEvent('mousemove', { movementX: 30, clientX: 130, clientY: 100 }));
		expect(field.value).toBe('6');

		await fireEvent(document, scrubEvent('mousemove', { movementX: -30, clientX: 90, clientY: 100 }));
		expect(field.value).toBe('5');

		await fireEvent(document, scrubEvent('mousemove', { movementX: 0, clientX: 90, clientY: 140 }));
		expect(field.value).toBe('5');

		await fireEvent(document, scrubEvent('mouseup'));
		expect(root().hasAttribute('data-scrubbing')).toBe(false);
		expect(document.getElementById(cursorId)).toBeNull();
		expect(document.documentElement.style.cursor).toBe('');
	});

	test('scrubs on touch pointers through ownerDocument pointer events', async () => {
		const pointerEvent = (type: string, init: PointerEventInit & { movementX?: number }) => {
			const event = new PointerEvent(type, { bubbles: true, cancelable: true, ...init });
			if (init.movementX !== undefined) {
				Object.defineProperty(event, 'movementX', { value: init.movementX });
			}
			return event;
		};

		render(Phase3NumberInput, { props: { defaultValue: '5', min: 0, max: 100, scrubber: true } });

		const scrubber = $('[data-part="scrubber"]')!;
		const cursorId = `${root().id}:cursor`;

		await fireEvent(
			scrubber,
			pointerEvent('pointerdown', { pointerType: 'touch', clientX: 60, clientY: 40 })
		);
		expect(input().value).toBe('5');
		expect(root().hasAttribute('data-scrubbing')).toBe(true);

		await fireEvent(
			document,
			pointerEvent('pointermove', { pointerType: 'touch', movementX: -20, clientX: 40 })
		);
		expect(input().value).toBe('4');

		await fireEvent(document, pointerEvent('pointerup', { pointerType: 'touch' }));
		expect(root().hasAttribute('data-scrubbing')).toBe(false);
		expect(document.getElementById(cursorId)).toBeNull();
	});

	test('mirrors disabled, read-only and required affordances', async () => {
		const { unmount } = render(Phase3NumberInput, {
			props: { defaultValue: '5', disabled: true }
		});
		expect(root().hasAttribute('data-disabled')).toBe(true);
		expect(input().disabled).toBe(true);
		expect(incrementTrigger().disabled).toBe(true);
		expect(decrementTrigger().disabled).toBe(true);
		unmount();

		render(Phase3NumberInput, { props: { defaultValue: '5', readOnly: true, required: true } });
		expect(input().readOnly).toBe(true);
		expect(input().required).toBe(true);
		expect(incrementTrigger().disabled).toBe(true);
	});

	test('never renders a value text duplicate of the raw input value', async () => {
		render(Phase3NumberInput, { props: { defaultValue: '2.5', valueText: true } });
		expect($('[data-part="value-text"]')!.textContent).toBe('2.5');
		await fireEvent.input(input(), { target: { value: '3.5' } });
		expect($('[data-part="value-text"]')!.textContent).toBe('3.5');
	});

	test('notifies value change only when the value actually changes', async () => {
		const onChange = vi.fn();
		render(Phase3NumberInput, {
			props: { defaultValue: '5', min: 0, max: 10, onValueChange: onChange }
		});

		await fireEvent.focus(input());
		await fireEvent.blur(input());
		expect(onChange).not.toHaveBeenCalled();

		await fireEvent.focus(input());
		await fireEvent.input(input(), { target: { value: '7' } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith({ value: '7', valueAsNumber: 7 });
	});

	test('exposes translated value text through aria-valuetext', async () => {
		render(Phase3NumberInput, {
			props: {
				defaultValue: '5',
				translations: { valueText: (value: string) => `${value} items` }
			}
		});
		expect(input().getAttribute('aria-valuetext')).toBe('5 items');
	});

	test('emits a single root per render', () => {
		render(Phase3NumberInput, { props: {} });
		expect($$('[data-scope="number-input"]').length).toBeGreaterThan(4);
		expect($$('[data-part="root"]').length).toBe(1);
	});
});
