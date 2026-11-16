import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase5Select from './harness/Phase5Select.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

const trigger = () => $('[data-part="trigger"]');
const content = () => $('[data-part="content"]');
const item = (value: string) => $(`[data-part="item"][data-value="${value}"]`);
const hiddenSelect = () => $<HTMLSelectElement>('[data-part="hidden-select"]');

const frame = () =>
	new Promise<void>((resolve) => {
		if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
		else setTimeout(() => resolve(), 0);
	});

const settle = async () => {
	for (let index = 0; index < 4; index++) {
		await frame();
		await tick();
	}
};

describe('Select', () => {
	test('renders the closed anatomy with trigger, control and hidden select hooks', () => {
		render(Phase5Select, { props: { lazyMount: false, unmountOnExit: false } });

		const root = $('[data-scope="select"][data-part="root"]')!;
		expect(root.id).toBe('select-root');
		expect(root.getAttribute('data-slot')).toBe('select-root');

		const label = $('[data-part="label"]')!;
		expect(label.id).toBe('select-label');
		expect(label.getAttribute('for')).toBe('select-hidden');
		expect(label.tagName).toBe('LABEL');

		const control = $('[data-part="control"]')!;
		expect(control.id).toBe('select-control');
		expect(control.getAttribute('data-state')).toBe('closed');
		expect(control.getAttribute('data-slot')).toBe('select-control');

		const button = trigger()!;
		expect(button.tagName).toBe('BUTTON');
		expect(button.id).toBe('select-trigger');
		expect(button.getAttribute('type')).toBe('button');
		expect(button.getAttribute('role')).toBe('combobox');
		expect(button.getAttribute('aria-haspopup')).toBe('listbox');
		expect(button.getAttribute('aria-controls')).toBe('select-content');
		expect(button.getAttribute('aria-expanded')).toBe('false');
		expect(button.getAttribute('aria-labelledby')).toBe('select-label');
		expect(button.getAttribute('data-state')).toBe('closed');
		expect(button.hasAttribute('data-placeholder-shown')).toBe(true);
		expect(button.getAttribute('data-placement')).toBe('bottom-start');

		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Pick a produce');
		expect($('[data-part="indicator"]')!.getAttribute('data-state')).toBe('closed');
		expect($('[data-part="indicator"]')!.getAttribute('aria-hidden')).toBe('true');

		const list = content()!;
		expect(list.id).toBe('select-content');
		expect(list.getAttribute('role')).toBe('listbox');
		expect(list.getAttribute('tabindex')).toBe('0');
		expect(list.getAttribute('aria-labelledby')).toBe('select-label');
		expect(list.getAttribute('data-state')).toBe('closed');
		expect(list.hidden).toBe(true);
		expect($('[data-part="positioner"]')!.id).toBe('select-positioner');

		const select = hiddenSelect()!;
		expect(select.tagName).toBe('SELECT');
		expect(select.name).toBe('produce');
		expect(select.getAttribute('aria-hidden')).toBe('true');
		expect(select.tabIndex).toBe(-1);
		expect(select.options.length).toBeGreaterThanOrEqual(6);
		expect(select.value).toBe('');

		const group = $('[data-part="item-group"]')!;
		expect(group.getAttribute('role')).toBe('group');
		expect(group.id).toBe('select-group-fruits');
		expect(group.getAttribute('aria-labelledby')).toBe('select-group-label-fruits');
		expect(item('apple')!.getAttribute('data-slot')).toBe('select-item');
		expect(item('apple')!.getAttribute('data-state')).toBe('unchecked');
	});

	test('opens on trigger click and reports the open state', async () => {
		const onOpenChange = vi.fn();
		render(Phase5Select, { props: { lazyMount: false, unmountOnExit: false, onOpenChange } });

		await fireEvent.click(trigger()!);

		expect(onOpenChange).toHaveBeenCalledWith({ open: true, value: [] });
		expect(trigger()!.getAttribute('aria-expanded')).toBe('true');
		expect(trigger()!.getAttribute('data-state')).toBe('open');
		expect(content()!.hidden).toBe(false);
		expect(content()!.getAttribute('data-state')).toBe('open');
		expect(content()!.getAttribute('data-placement')).toBe('bottom-start');
		expect(content()!.getAttribute('data-side')).toBe('bottom');
		expect($('[data-part="control"]')!.getAttribute('data-state')).toBe('open');

		await fireEvent.click(trigger()!);

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false, value: [] });
		expect(trigger()!.getAttribute('aria-expanded')).toBe('false');
		expect(content()!.hidden).toBe(true);
	});

	test('selects an item, mirrors it into the hidden select and closes', async () => {
		const onValueChange = vi.fn();
		render(Phase5Select, { props: { lazyMount: false, unmountOnExit: false, onValueChange } });

		await fireEvent.click(trigger()!);
		await fireEvent.click(item('apple')!);

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange.mock.calls[0][0].value).toEqual(['apple']);
		expect(onValueChange.mock.calls[0][0].items).toEqual([{ value: 'apple', label: 'Apple' }]);

		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apple');
		expect(item('apple')!.getAttribute('aria-selected')).toBe('true');
		expect(item('apple')!.getAttribute('data-state')).toBe('checked');
		expect(hiddenSelect()!.value).toBe('apple');

		// closeOnSelect defaults to true for a single select.
		expect(trigger()!.getAttribute('aria-expanded')).toBe('false');
		expect(content()!.hidden).toBe(true);
		expect(trigger()!.hasAttribute('data-placeholder-shown')).toBe(false);
		expect(document.activeElement).toBe(trigger());
	});

	test('keeps the menu open and accumulates values when multiple', async () => {
		const onValueChange = vi.fn();
		render(Phase5Select, { props: { lazyMount: false, unmountOnExit: false, multiple: true, onValueChange } });

		await fireEvent.click(trigger()!);
		expect(content()!.getAttribute('aria-multiselectable')).toBe('true');

		await fireEvent.click(item('apple')!);
		await fireEvent.click(item('daikon')!);

		expect(onValueChange.mock.calls[1][0].value).toEqual(['apple', 'daikon']);
		expect(item('apple')!.getAttribute('data-state')).toBe('checked');
		expect(item('daikon')!.getAttribute('data-state')).toBe('checked');
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apple, Daikon');
		expect(content()!.hidden).toBe(false);
		expect(trigger()!.getAttribute('aria-expanded')).toBe('true');
		expect(hiddenSelect()!.multiple).toBe(true);
		expect(Array.from(hiddenSelect()!.options).filter((option) => option.selected).map((option) => option.value)).toEqual([
			'apple',
			'daikon'
		]);
	});

	test('opens from the keyboard, roves the highlight and selects with Enter', async () => {
		const onValueChange = vi.fn();
		render(Phase5Select, { props: { lazyMount: false, unmountOnExit: false, onValueChange } });

		const button = trigger()!;
		button.focus();
		await tick();
		expect($('[data-part="control"]')!.hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(button, { key: 'ArrowDown' });
		expect(trigger()!.getAttribute('aria-expanded')).toBe('true');
		expect(item('apple')!.hasAttribute('data-highlighted')).toBe(true);
		expect(content()!.getAttribute('aria-activedescendant')).toBe('select-item-apple');
		expect(content()!.getAttribute('data-activedescendant')).toBe('select-item-apple');

		await fireEvent.keyDown(content()!, { key: 'ArrowDown' });
		expect(item('apricot')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(content()!, { key: 'ArrowDown' });
		expect(item('banana')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(content()!, { key: 'End' });
		expect(item('daikon')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(content()!, { key: 'Enter' });
		expect(onValueChange.mock.calls.at(-1)![0].value).toEqual(['daikon']);
		expect(trigger()!.getAttribute('aria-expanded')).toBe('false');
		expect(item('daikon')!.getAttribute('data-state')).toBe('checked');
	});

	test('typeahead selects through the closed trigger and Escape closes the menu', async () => {
		const onValueChange = vi.fn();
		render(Phase5Select, { props: { lazyMount: false, unmountOnExit: false, onValueChange } });

		const button = trigger()!;
		button.focus();

		await fireEvent.keyDown(button, { key: 'b' });
		expect(onValueChange.mock.calls.at(-1)![0].value).toEqual(['banana']);
		expect(trigger()!.getAttribute('aria-expanded')).toBe('false');
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Banana');

		await new Promise((resolve) => setTimeout(resolve, 400));

		// A repeated character cycles through the items that start with it.
		await fireEvent.keyDown(button, { key: 'a' });
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apple');
		await fireEvent.keyDown(button, { key: 'a' });
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apricot');

		await fireEvent.keyDown(button, { key: 'ArrowUp' });
		expect(trigger()!.getAttribute('aria-expanded')).toBe('true');
		// ArrowUp opens on the first of the selected values.
		expect(item('apricot')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(content()!, { key: 'Escape' });
		expect(trigger()!.getAttribute('aria-expanded')).toBe('false');
		expect(content()!.hidden).toBe(true);
	});

	test('composes the field shorthand with a clear trigger', () => {
		render(Phase5Select, { props: { variant: 'field', defaultValue: 'apple' } });

		expect($('[data-part="control"]')!.querySelector('[data-part="trigger"]')).not.toBeNull();
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apple');
		expect($('[data-part="clear-trigger"]')!.hidden).toBe(false);
		expect($('[data-part="indicator"]')!.querySelector('svg')).not.toBeNull();
	});

	test('clears the value from the clear trigger and deselects the selected item', async () => {
		render(Phase5Select, {
			props: { lazyMount: false, unmountOnExit: false, defaultValue: 'apple', deselectable: true }
		});

		const clear = $('[data-part="clear-trigger"]')!;
		expect(clear.getAttribute('data-slot')).toBe('select-clear-trigger');
		expect(clear.getAttribute('aria-label')).toBe('Clear selection');
		expect(clear.hidden).toBe(false);
		expect(hiddenSelect()!.value).toBe('apple');

		await fireEvent.click(trigger()!);
		await fireEvent.click(item('apple')!);
		expect(item('apple')!.getAttribute('aria-selected')).toBe('false');
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Pick a produce');

		await fireEvent.click(item('apple')!);
		expect(item('apple')!.getAttribute('aria-selected')).toBe('true');
		expect(clear.hidden).toBe(false);

		await fireEvent.click(clear);
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Pick a produce');
		expect(clear.hidden).toBe(true);
		expect(hiddenSelect()!.value).toBe('');
	});

	test('portals the positioner, dismisses outside and unmounts it on close', async () => {
		render(Phase5Select, { props: { portalled: true, lazyMount: true, unmountOnExit: true } });

		expect($('[data-part="positioner"]')).toBeNull();

		await fireEvent.click(trigger()!);
		await tick();

		const positioner = $('[data-part="positioner"]')!;
		expect(positioner).not.toBeNull();
		expect(positioner.closest('[data-rta-portal]')).not.toBeNull();
		expect(document.body.contains(positioner)).toBe(true);
		expect(item('apple')!.closest('[data-rta-portal]')).not.toBeNull();

		await fireEvent.pointerDown(document.body);
		await tick();

		expect(trigger()!.getAttribute('aria-expanded')).toBe('false');
		expect(document.activeElement).toBe(trigger());
		await settle();
		expect($('[data-part="positioner"]')).toBeNull();

		await fireEvent.click(trigger()!);
		await tick();
		await fireEvent.click(item('apple')!);
		await settle();

		expect($('[data-part="positioner"]')).toBeNull();
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apple');
	});
});
