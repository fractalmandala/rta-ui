import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import ToggleBasic from './harness/ToggleBasic.svelte';
import ToggleGroupBasic from './harness/ToggleGroupBasic.svelte';

function toggleRoot() {
	return document.querySelector('[data-scope="toggle"][data-part="root"]') as HTMLButtonElement;
}

function groupRoot() {
	return document.querySelector('[data-scope="toggle-group"][data-part="root"]') as HTMLElement;
}

function groupItems() {
	return Array.from(
		document.querySelectorAll('[data-scope="toggle-group"][data-part="item"]')
	) as HTMLButtonElement[];
}

describe('Toggle', () => {
	test('renders the ark contract', () => {
		render(ToggleBasic, { props: { defaultPressed: true } });

		expect(toggleRoot().tagName).toBe('BUTTON');
		expect(toggleRoot().type).toBe('button');
		expect(toggleRoot().getAttribute('aria-pressed')).toBe('true');
		expect(toggleRoot().getAttribute('data-state')).toBe('on');
		expect(toggleRoot().getAttribute('data-pressed')).toBe('');
		expect(toggleRoot().getAttribute('data-size')).toBe('sm');
		expect(toggleRoot().getAttribute('data-variant')).toBe('outline');
		expect(toggleRoot().getAttribute('data-slot')).toBe('toggle-root');

		const indicator = document.querySelector('[data-part="indicator"]')!;
		expect(indicator.getAttribute('data-state')).toBe('on');
	});

	test('toggles and reports onPressedChange', async () => {
		const onPressedChange = vi.fn();
		render(ToggleBasic, { props: { onPressedChange } });

		await fireEvent.click(toggleRoot());
		expect(onPressedChange).toHaveBeenCalledWith({ pressed: true });
		expect(toggleRoot().getAttribute('data-state')).toBe('on');

		await fireEvent.click(toggleRoot());
		expect(onPressedChange).toHaveBeenLastCalledWith({ pressed: false });
		expect(toggleRoot().getAttribute('data-state')).toBe('off');
		expect(toggleRoot().hasAttribute('data-pressed')).toBe(false);
	});

	test('disabled blocks interaction', async () => {
		const onPressedChange = vi.fn();
		render(ToggleBasic, { props: { disabled: true, onPressedChange } });

		expect(toggleRoot().disabled).toBe(true);
		expect(toggleRoot().getAttribute('data-disabled')).toBe('');
		await fireEvent.click(toggleRoot());
		expect(onPressedChange).not.toHaveBeenCalled();
	});
});

describe('ToggleGroup', () => {
	test('renders the ark contract', () => {
		render(ToggleGroupBasic, { props: { defaultValue: ['center'] } });

		expect(groupRoot().getAttribute('role')).toBe('radiogroup');
		expect(groupRoot().getAttribute('data-orientation')).toBe('horizontal');
		expect(groupRoot().getAttribute('data-slot')).toBe('toggle-group-root');

		const [left, center, right] = groupItems();
		expect(left.getAttribute('role')).toBe('radio');
		expect(left.getAttribute('aria-checked')).toBe('false');
		expect(center.getAttribute('aria-checked')).toBe('true');
		expect(center.getAttribute('data-state')).toBe('on');
		expect(left.getAttribute('data-ownedby')).toBe(groupRoot().id);
		expect(right.disabled).toBe(true);
		expect(right.getAttribute('data-disabled')).toBe('');
	});

	test('single mode replaces the selection', async () => {
		const onValueChange = vi.fn();
		render(ToggleGroupBasic, { props: { onValueChange } });

		await fireEvent.click(groupItems()[0]);
		expect(onValueChange).toHaveBeenLastCalledWith({ value: ['left'] });

		await fireEvent.click(groupItems()[0]);
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	test('deselectable false keeps at least one value', async () => {
		const onValueChange = vi.fn();
		render(ToggleGroupBasic, { props: { defaultValue: ['left'], deselectable: false, onValueChange } });

		await fireEvent.click(groupItems()[0]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test('multiple mode appends values and uses a group role', async () => {
		const onValueChange = vi.fn();
		render(ToggleGroupBasic, { props: { multiple: true, onValueChange } });

		expect(groupRoot().getAttribute('role')).toBe('group');
		await fireEvent.click(groupItems()[0]);
		await fireEvent.click(groupItems()[1]);
		expect(onValueChange).toHaveBeenLastCalledWith({ value: ['left', 'center'] });
		expect(groupItems()[0].getAttribute('aria-pressed')).toBe('true');
	});

	test('arrow keys move roving focus and skip disabled items', async () => {
		render(ToggleGroupBasic);

		groupItems()[0].focus();
		await fireEvent.focus(groupItems()[0]);
		expect(groupItems()[0].getAttribute('data-focus')).toBe('');
		expect(groupItems()[0].tabIndex).toBe(0);

		await fireEvent.keyDown(groupItems()[0], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(groupItems()[1]);
		expect(groupItems()[1].getAttribute('data-focus')).toBe('');
		expect(groupItems()[0].hasAttribute('data-focus')).toBe(false);
	});

	test('vertical orientation ignores horizontal arrows', async () => {
		render(ToggleGroupBasic, { props: { orientation: 'vertical' } });
		expect(groupRoot().getAttribute('data-orientation')).toBe('vertical');

		groupItems()[0].focus();
		await fireEvent.keyDown(groupItems()[0], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(groupItems()[0]);

		await fireEvent.keyDown(groupItems()[0], { key: 'ArrowDown' });
		expect(document.activeElement).toBe(groupItems()[1]);
	});
});
