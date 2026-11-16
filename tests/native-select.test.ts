import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase3NativeSelect from './harness/Phase3NativeSelect.svelte';
import Phase3Field from './harness/Phase3Field.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

describe('NativeSelect', () => {
	test('renders the control, select and indicator parts', () => {
		render(Phase3NativeSelect, { props: {} });

		const control = $('[data-scope="native-select"][data-part="control"]')!;
		expect(control.getAttribute('data-slot')).toBe('native-select-control');

		const select = $('[data-part="select"]') as HTMLSelectElement;
		expect(select.tagName).toBe('SELECT');
		expect(select.getAttribute('data-slot')).toBe('native-select-root');
		expect(select.value).toBe('b');

		const indicator = $('[data-part="indicator"]')!;
		expect(indicator.getAttribute('data-slot')).toBe('native-select-indicator');
		expect(indicator.getAttribute('aria-hidden')).toBe('true');
		expect(indicator.querySelector('svg')).not.toBeNull();
	});

	test('emits change events and updates the bound value', async () => {
		const onChange = vi.fn();
		render(Phase3NativeSelect, { props: { onChange } });

		const select = $('[data-part="select"]') as HTMLSelectElement;
		select.value = 'c';
		await fireEvent.input(select);
		await fireEvent.change(select);

		expect(onChange).toHaveBeenCalledWith('c');
	});

	test('reuses the field context so a disabled field disables the select', () => {
		render(Phase3Field, { props: { disabled: true } });
		const select = $('[data-scope="field"][data-part="select"]') as HTMLSelectElement;
		expect(select.disabled).toBe(true);
	});

	test('renders standalone without a field context', () => {
		render(Phase3NativeSelect, { props: {} });
		const select = $('[data-part="select"]') as HTMLSelectElement;
		expect(select.hasAttribute('aria-invalid')).toBe(false);
		expect(select.disabled).toBe(false);
	});
});
