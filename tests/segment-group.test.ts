import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import SegmentGroupBasic from './harness/SegmentGroupBasic.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

describe('SegmentGroup', () => {
	test('renders the Ark contract', () => {
		render(SegmentGroupBasic);

		const root = $('[data-scope="segment-group"][data-part="root"]')!;
		expect(root.getAttribute('role')).toBe('radiogroup');
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.getAttribute('data-size')).toBe('md');
		expect(root.getAttribute('data-slot')).toBe('segment-group-root');
		expect(root.getAttribute('aria-labelledby')).toBe($('[data-part="label"]')!.id);

		const items = document.querySelectorAll('[data-part="item"]');
		expect(items).toHaveLength(3);
		expect(items[0].tagName.toLowerCase()).toBe('label');
		expect(items[0].getAttribute('data-state')).toBe('unchecked');
		expect(items[2].getAttribute('data-disabled')).toBe('');
		expect(items[2].getAttribute('data-state')).toBe('unchecked');

		const inputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
		expect(inputs).toHaveLength(3);
		expect(inputs[0].getAttribute('data-ownedby')).toBe(root.id);
		expect(inputs[2].disabled).toBe(true);
	});

	test('clicking an item selects it and reports the change', async () => {
		const onValueChange = vi.fn();
		render(SegmentGroupBasic, { props: { onValueChange } });

		const inputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
		await fireEvent.mouseDown(inputs[1]);
		await fireEvent.click(inputs[1]);
		await fireEvent.change(inputs[1]);

		expect(onValueChange).toHaveBeenCalledWith({ value: 'md' });
		expect($('[data-part="item"][data-state="checked"]')!.getAttribute('data-value')).toBeNull();
		expect(inputs[1].checked).toBe(true);
	});

	test('a disabled group blocks selection', async () => {
		const onValueChange = vi.fn();
		render(SegmentGroupBasic, { props: { disabled: true, onValueChange } });

		const inputs = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
		expect(inputs[0].disabled).toBe(true);
		expect($('[data-part="root"]')!.getAttribute('aria-disabled')).toBe('true');

		await fireEvent.click(inputs[0]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test('the indicator is hidden until a value is measured', () => {
		render(SegmentGroupBasic, { props: { value: 'md' } });
		expect(screen.queryByText('Sizes')).toBeTruthy();
		expect($('[data-part="indicator"]')).toBeTruthy();
	});
});
