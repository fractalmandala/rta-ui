import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import RadioGroupBasic from './harness/RadioGroupBasic.svelte';

function root() {
	return document.querySelector('[data-scope="radio-group"][data-part="root"]') as HTMLElement;
}

function items() {
	return Array.from(
		document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
	) as HTMLLabelElement[];
}

function inputs() {
	return Array.from(
		document.querySelectorAll('[data-scope="radio-group"] input')
	) as HTMLInputElement[];
}

describe('RadioGroup', () => {
	test('renders the ark contract', () => {
		render(RadioGroupBasic, { props: { defaultValue: 'apple' } });

		expect(root().getAttribute('role')).toBe('radiogroup');
		expect(root().getAttribute('data-orientation')).toBe('horizontal');
		expect(root().getAttribute('data-slot')).toBe('radio-group-root');
		expect(root().getAttribute('aria-labelledby')).toBe(
			document.querySelector('[data-part="label"]')!.id
		);

		const [apple, banana, cherry] = items();
		expect(apple.tagName).toBe('LABEL');
		expect(apple.getAttribute('data-state')).toBe('checked');
		expect(apple.getAttribute('data-disabled')).toBeNull();
		expect(banana.getAttribute('data-state')).toBe('unchecked');
		expect(cherry.getAttribute('data-disabled')).toBe('');

		const control = document.querySelector('[data-part="item-control"]')!;
		expect(control.getAttribute('aria-hidden')).toBe('true');
		expect(control.getAttribute('data-state')).toBe('checked');

		const [appleInput] = inputs();
		expect(appleInput.type).toBe('radio');
		expect(appleInput.name).toBe('fruit');
		expect(appleInput.checked).toBe(true);
		expect(appleInput.getAttribute('data-ownedby')).toBe(root().id);
		expect(appleInput.getAttribute('aria-labelledby')).toBe(
			document.querySelector('[data-part="item-text"]')!.id
		);
	});

	test('selecting an item reports the value and updates state', async () => {
		const onValueChange = vi.fn();
		render(RadioGroupBasic, { props: { defaultValue: 'apple', onValueChange } });

		inputs()[1].click();
		await fireEvent.click(inputs()[1]);
		expect(onValueChange).toHaveBeenCalledWith({ value: 'banana' });
		expect(items()[1].getAttribute('data-state')).toBe('checked');
		expect(items()[0].getAttribute('data-state')).toBe('unchecked');
	});

	test('group disabled blocks selection', async () => {
		const onValueChange = vi.fn();
		render(RadioGroupBasic, { props: { disabled: true, onValueChange } });

		expect(root().getAttribute('data-disabled')).toBe('');
		expect(root().getAttribute('aria-disabled')).toBe('true');
		await fireEvent.click(inputs()[0]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(inputs()[0].disabled).toBe(true);
	});

	test('readOnly blocks selection', async () => {
		const onValueChange = vi.fn();
		render(RadioGroupBasic, { props: { onValueChange, readOnly: true } });

		expect(root().getAttribute('aria-readonly')).toBe('true');
		expect(items()[0].getAttribute('data-readonly')).toBe('');
		await fireEvent.click(inputs()[0]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test('required and invalid are announced', () => {
		render(RadioGroupBasic, { props: { invalid: true, required: true } });

		expect(root().getAttribute('aria-required')).toBe('true');
		expect(root().getAttribute('data-required')).toBe('');
		expect(root().getAttribute('data-invalid')).toBe('');
		expect(items()[0].getAttribute('data-invalid')).toBe('');
		expect(inputs()[0].getAttribute('aria-invalid')).toBe('true');
	});

	test('hovering and focusing mark the item', async () => {
		render(RadioGroupBasic);

		await fireEvent.pointerMove(items()[0]);
		expect(items()[0].getAttribute('data-hover')).toBe('');
		await fireEvent.pointerLeave(items()[0]);
		expect(items()[0].hasAttribute('data-hover')).toBe(false);

		inputs()[0].focus();
		await fireEvent.focus(inputs()[0]);
		expect(items()[0].getAttribute('data-focus')).toBe('');
		await fireEvent.blur(inputs()[0]);
		expect(items()[0].hasAttribute('data-focus')).toBe(false);
	});
});
