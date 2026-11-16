import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase3PinInput from './harness/Phase3PinInput.svelte';

afterEach(cleanup);

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const inputs = () =>
	[...document.querySelectorAll('[data-scope="pin-input"][data-part="input"]')] as HTMLInputElement[];
const hidden = () =>
	document.querySelector('[data-scope="pin-input"][data-part="hidden-input"]') as HTMLInputElement;
const flush = async () => {
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('PinInput', () => {
	test('renders the Ark contract', async () => {
		render(Phase3PinInput, { props: {} });
		await flush();

		const root = $('[data-scope="pin-input"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('pin-input-root');
		expect(root.hasAttribute('data-complete')).toBe(false);
		expect(root.id).toMatch(/^pin-input:/);

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('pin-input-label');
		expect(label.id).toBe(`${root.id}:label`);
		expect(label.getAttribute('for')).toBe(`${root.id}:hidden`);

		const control = $('[data-part="control"]')!;
		expect(control.getAttribute('role')).toBe('group');
		expect(control.getAttribute('aria-labelledby')).toBe(label.id);

		const rendered = inputs();
		expect(rendered).toHaveLength(4);
		rendered.forEach((input, index) => {
			expect(input.id).toBe(`${root.id}:${index}`);
			expect(input.getAttribute('data-ownedby')).toBe(root.id);
			expect(input.getAttribute('data-index')).toBe(String(index));
			expect(input.getAttribute('aria-label')).toBe(`pin code ${index + 1} of 4`);
			expect(input.type).toBe('tel');
			expect(input.getAttribute('inputmode')).toBe('numeric');
			expect(input.getAttribute('autocomplete')).toBe('off');
			expect(input.getAttribute('tabindex')).toBe(index === 0 ? '0' : '-1');
		});

		expect(hidden().getAttribute('data-slot')).toBe('pin-input-hidden-input');
		expect(hidden().id).toBe(`${root.id}:hidden`);
		expect(hidden().name).toBe('code');
		expect(hidden().getAttribute('minlength')).toBe('4');
		expect(hidden().getAttribute('pattern')).toBe('[0-9]{4}');
		expect(hidden().style.border).toBe('0px');
	});

	test('typing fills the value, advances focus and mirrors into the hidden input', async () => {
		const onValueChange = vi.fn();
		const onValueComplete = vi.fn();
		const { component } = render(Phase3PinInput, { props: { onValueChange, onValueComplete } });
		await flush();

		const rendered = inputs();
		await fireEvent.focus(rendered[0]);
		await fireEvent.input(rendered[0], { target: { value: '1' } });
		await flush();

		expect(document.activeElement).toBe(rendered[1]);
		expect(rendered[0].value).toBe('1');
		expect(rendered[0].hasAttribute('data-filled')).toBe(true);
		expect(onValueChange).toHaveBeenLastCalledWith({ value: ['1', '', '', ''], valueAsString: '1' });
		expect(hidden().value).toBe('1');

		await fireEvent.input(rendered[1], { target: { value: '2' } });
		await fireEvent.input(rendered[2], { target: { value: '3' } });
		await fireEvent.input(rendered[3], { target: { value: '4' } });
		await flush();

		expect(hidden().value).toBe('1234');
		expect($('[data-part="root"]')!.hasAttribute('data-complete')).toBe(true);
		expect(onValueComplete).toHaveBeenCalledWith({
			value: ['1', '2', '3', '4'],
			valueAsString: '1234'
		});
		expect(component).toBeTruthy();
	});

	test('ignores characters outside the numeric pattern and reports them', async () => {
		const onValueChange = vi.fn();
		render(Phase3PinInput, { props: { onValueChange } });
		await flush();

		const first = inputs()[0];
		const event = new InputEvent('beforeinput', {
			data: 'a',
			bubbles: true,
			cancelable: true,
			inputType: 'insertText'
		});
		first.dispatchEvent(event);
		await flush();

		expect(event.defaultPrevented).toBe(true);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(hidden().value).toBe('');
	});

	test('keyboard navigation and backspace follow the machine', async () => {
		render(Phase3PinInput, { props: {} });
		await flush();

		const rendered = inputs();
		await fireEvent.focus(rendered[0]);
		await fireEvent.input(rendered[0], { target: { value: '7' } });
		await fireEvent.input(rendered[1], { target: { value: '8' } });
		await flush();

		rendered[2].focus();
		await fireEvent.keyDown(rendered[2], { key: 'Home' });
		await flush();
		expect(document.activeElement).toBe(rendered[0]);

		await fireEvent.keyDown(rendered[0], { key: 'End' });
		await flush();
		expect(document.activeElement).toBe(rendered[1]);

		await fireEvent.keyDown(rendered[1], { key: 'Backspace' });
		await flush();
		expect(hidden().value).toBe('7');
		expect(rendered[1].value).toBe('');
	});

	test('disables, masks and marks invalid parts from props', async () => {
		const { unmount } = render(Phase3PinInput, { props: { disabled: true } });
		await flush();

		const root = $('[data-part="root"]')!;
		expect(root.getAttribute('data-disabled')).toBe('');
		inputs().forEach((input) => expect(input.disabled).toBe(true));
		expect(hidden().disabled).toBe(true);
		unmount();

		render(Phase3PinInput, { props: { mask: true, invalid: true, otp: true } });
		await flush();

		const masked = inputs();
		expect(masked.every((input) => input.type === 'password')).toBe(true);
		expect(masked[0].getAttribute('inputmode')).toBe('numeric');
		expect(masked[0].getAttribute('autocomplete')).toBe('one-time-code');
		expect($('[data-part="root"]')!.getAttribute('data-invalid')).toBe('');
		expect(masked[0].getAttribute('aria-invalid')).toBe('true');
		expect(masked[0].getAttribute('data-invalid')).toBe('');
	});
});
