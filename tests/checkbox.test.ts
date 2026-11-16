import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import CheckboxBasic from './harness/CheckboxBasic.svelte';

function root() {
	return document.querySelector('[data-scope="checkbox"][data-part="root"]') as HTMLElement;
}

function inputs() {
	return Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
}

describe('Checkbox', () => {
	test('renders the ark contract', () => {
		render(CheckboxBasic, { props: { defaultChecked: true } });

		expect(root().tagName).toBe('LABEL');
		expect(root().getAttribute('data-state')).toBe('checked');
		expect(root().getAttribute('data-slot')).toBe('checkbox-root');

		const control = document.querySelector('[data-part="control"]')!;
		expect(control.getAttribute('aria-hidden')).toBe('true');

		const indicators = Array.from(document.querySelectorAll('[data-part="indicator"]'));
		expect(indicators).toHaveLength(2);
		expect((indicators[0] as HTMLElement).hidden).toBe(false);
		expect((indicators[1] as HTMLElement).hidden).toBe(true);

		const input = inputs()[0];
		expect(input.type).toBe('checkbox');
		expect(input.checked).toBe(true);
		expect(input.getAttribute('aria-labelledby')).toBe(
			document.querySelector('[data-part="label"]')!.id
		);
	});

	test('toggles and reports changes', async () => {
		const onCheckedChange = vi.fn();
		render(CheckboxBasic, { props: { onCheckedChange } });

		await fireEvent.click(inputs()[0]);
		expect(onCheckedChange).toHaveBeenCalledWith({ checked: true });
		expect(root().getAttribute('data-state')).toBe('checked');

		await fireEvent.click(inputs()[0]);
		expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: false });
		expect(root().getAttribute('data-state')).toBe('unchecked');
	});

	test('indeterminate wins over checked for data-state and indicators', () => {
		render(CheckboxBasic, { props: { indeterminate: true } });

		expect(root().getAttribute('data-state')).toBe('indeterminate');
		const indicators = Array.from(document.querySelectorAll('[data-part="indicator"]')) as HTMLElement[];
		expect(indicators[0].hidden).toBe(true);
		expect(indicators[1].hidden).toBe(false);
	});

	test('disabled blocks interaction', async () => {
		const onCheckedChange = vi.fn();
		render(CheckboxBasic, { props: { disabled: true, onCheckedChange } });

		expect(root().getAttribute('data-disabled')).toBe('');
		expect(inputs()[0].disabled).toBe(true);
		await fireEvent.click(inputs()[0]);
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	test('group owns the value of its checkboxes', async () => {
		const onValueChange = vi.fn();
		render(CheckboxBasic, { props: { groupValue: ['b'], onValueChange } });

		const group = document.querySelector('[data-part="group"]')!;
		expect(group.getAttribute('role')).toBe('group');
		expect(group.getAttribute('data-scope')).toBe('checkbox');

		const [first, second] = Array.from(document.querySelectorAll('[data-part="root"]')) as HTMLElement[];
		expect(first.getAttribute('data-state')).toBe('unchecked');
		expect(second.getAttribute('data-state')).toBe('checked');

		await fireEvent.click(inputs()[0]);
		expect(onValueChange).toHaveBeenCalledWith({ value: ['b', 'a'] });
	});
});
