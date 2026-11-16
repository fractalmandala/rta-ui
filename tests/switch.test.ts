import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import SwitchBasic from './harness/SwitchBasic.svelte';

function root() {
	return document.querySelector('[data-scope="switch"][data-part="root"]') as HTMLElement;
}

describe('Switch', () => {
	test('renders the ark contract', () => {
		render(SwitchBasic, { props: { defaultChecked: true } });

		expect(root().tagName).toBe('LABEL');
		expect(root().getAttribute('data-state')).toBe('checked');
		expect(root().getAttribute('data-slot')).toBe('switch-root');

		const control = document.querySelector('[data-part="control"]')!;
		expect(control.getAttribute('aria-hidden')).toBe('true');

		const thumb = document.querySelector('[data-part="thumb"]')!;
		expect(thumb.getAttribute('aria-hidden')).toBe('true');
		expect(thumb.getAttribute('data-state')).toBe('checked');

		const label = document.querySelector('[data-part="label"]')!;
		const input = document.querySelector('input') as HTMLInputElement;
		expect(input.type).toBe('checkbox');
		expect(input.checked).toBe(true);
		expect(input.getAttribute('aria-labelledby')).toBe(label.id);
		expect(root().getAttribute('for')).toBe(input.id);
	});

	test('toggles on input click and reports onCheckedChange', async () => {
		const onCheckedChange = vi.fn();
		render(SwitchBasic, { props: { onCheckedChange } });

		const input = document.querySelector('input') as HTMLInputElement;
		expect(root().getAttribute('data-state')).toBe('unchecked');

		await fireEvent.click(input);
		expect(onCheckedChange).toHaveBeenCalledWith({ checked: true });
		expect(root().getAttribute('data-state')).toBe('checked');

		await fireEvent.click(input);
		expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: false });
		expect(root().getAttribute('data-state')).toBe('unchecked');
	});

	test('honours the controlled checked prop', () => {
		render(SwitchBasic, { props: { checked: true, defaultChecked: false } });
		expect(root().getAttribute('data-state')).toBe('checked');
		expect((document.querySelector('input') as HTMLInputElement).checked).toBe(true);
	});

	test('disabled blocks interaction', async () => {
		const onCheckedChange = vi.fn();
		render(SwitchBasic, { props: { disabled: true, onCheckedChange } });

		const input = document.querySelector('input') as HTMLInputElement;
		expect(root().getAttribute('data-disabled')).toBe('');
		expect(input.disabled).toBe(true);

		await fireEvent.click(input);
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	test('readOnly blocks interaction', async () => {
		const onCheckedChange = vi.fn();
		render(SwitchBasic, { props: { readOnly: true, onCheckedChange } });

		expect(root().getAttribute('data-readonly')).toBe('');
		await fireEvent.click(document.querySelector('input') as HTMLInputElement);
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	test('hover and focus are reflected as data attributes', async () => {
		render(SwitchBasic);

		await fireEvent.pointerMove(root());
		expect(root().getAttribute('data-hover')).toBe('');

		await fireEvent.pointerLeave(root());
		expect(root().hasAttribute('data-hover')).toBe(false);

		await fireEvent.focus(document.querySelector('input')!);
		expect(root().getAttribute('data-focus')).toBe('');
		expect(screen.getByText('Airplane mode')).toBeTruthy();
	});

	test('sizes map to data-size', () => {
		render(SwitchBasic, { props: { size: 'xl' } });
		expect(root().getAttribute('data-size')).toBe('xl');
	});
});
