import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase5Listbox from './harness/Phase5Listbox.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

const item = (value: string) => $(`[data-part="item"][data-value="${value}"]`);
const content = () => $('[data-part="content"]');

const resetTypeahead = () => new Promise((resolve) => setTimeout(resolve, 400));

describe('Listbox', () => {
	test('renders the anatomy with moduix slots and Zag ids', () => {
		render(Phase5Listbox, { props: {} });

		const root = $('[data-scope="listbox"][data-part="root"]')!;
		expect(root.id).toBe('listbox-root');
		expect(root.getAttribute('data-slot')).toBe('listbox-root');
		expect(root.getAttribute('data-orientation')).toBe('vertical');
		expect(root.hasAttribute('data-disabled')).toBe(false);

		expect($('[data-part="label"]')!.id).toBe('listbox-label');
		expect($('[data-part="label"]')!.getAttribute('data-slot')).toBe('listbox-label');
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('None selected');

		const list = content()!;
		expect(list.tagName).toBe('DIV');
		expect(list.getAttribute('role')).toBe('listbox');
		expect(list.id).toBe('listbox-content');
		expect(list.getAttribute('tabindex')).toBe('0');
		expect(list.getAttribute('aria-labelledby')).toBe('listbox-label');
		expect(list.getAttribute('data-layout')).toBe('list');
		expect(list.getAttribute('data-empty')).toBeNull();
		expect(list.getAttribute('aria-multiselectable')).toBeNull();

		const apple = item('apple')!;
		expect(apple.getAttribute('role')).toBe('option');
		expect(apple.id).toBe('listbox-item-apple');
		expect(apple.getAttribute('data-slot')).toBe('listbox-item');
		expect(apple.getAttribute('data-state')).toBe('unchecked');
		expect(apple.getAttribute('aria-selected')).toBe('false');
		expect(apple.hasAttribute('data-selected')).toBe(false);
		expect(apple.hasAttribute('data-highlighted')).toBe(false);
		expect($('[data-part="item-text"]')!.getAttribute('data-slot')).toBe('listbox-item-text');
		expect($('[data-part="item-indicator"]')!.getAttribute('aria-hidden')).toBe('true');
		expect($('[data-part="item-indicator"]')!.hidden).toBe(true);

		const group = $('[data-part="item-group"]')!;
		expect(group.getAttribute('role')).toBe('group');
		expect(group.id).toBe('listbox-group-fruits');
		expect(group.getAttribute('aria-labelledby')).toBe('listbox-group-label-fruits');

		const label = $('[data-part="item-group-label"]')!;
		expect(label.id).toBe('listbox-group-label-fruits');
		expect(label.getAttribute('role')).toBe('presentation');
		expect(label.textContent?.trim()).toBe('Fruits');
	});

	test('selects a single item on click and reports items', async () => {
		const onValueChange = vi.fn();
		render(Phase5Listbox, { props: { onValueChange } });

		await fireEvent.click(item('banana')!);

		expect(onValueChange).toHaveBeenCalledTimes(1);
		const details = onValueChange.mock.calls[0][0];
		expect(details.value).toEqual(['banana']);
		expect(details.items).toEqual([{ value: 'banana', label: 'Banana' }]);

		expect(item('banana')!.getAttribute('aria-selected')).toBe('true');
		expect(item('banana')!.getAttribute('data-state')).toBe('checked');
		expect(item('banana')!.hasAttribute('data-selected')).toBe(true);
		expect($('[data-part="item-indicator"]:not([hidden])')).not.toBeNull();
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Banana');

		await fireEvent.mouseDown(item('apple')!);
		expect(document.activeElement).toBe(content());

		await fireEvent.click(item('apple')!);
		expect(item('banana')!.getAttribute('aria-selected')).toBe('false');
		expect(item('apple')!.getAttribute('aria-selected')).toBe('true');
	});

	test('roves the highlight from the keyboard and selects with Enter', async () => {
		const onValueChange = vi.fn();
		render(Phase5Listbox, { props: { onValueChange } });

		const list = content()!;
		list.focus();
		await tick();

		// Focus without a selection highlights the first item.
		expect(item('apple')!.hasAttribute('data-highlighted')).toBe(true);
		expect(list.getAttribute('aria-activedescendant')).toBe('listbox-item-apple');
		expect(list.getAttribute('data-activedescendant')).toBe('listbox-item-apple');

		await fireEvent.keyDown(list, { key: 'ArrowDown' });
		expect(item('apricot')!.hasAttribute('data-highlighted')).toBe(true);
		expect(list.getAttribute('aria-activedescendant')).toBe('listbox-item-apricot');

		// cherry is disabled, so the highlight steps over it.
		await fireEvent.keyDown(list, { key: 'ArrowDown' });
		expect(item('banana')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(list, { key: 'End' });
		expect(item('daikon')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(list, { key: 'Home' });
		expect(item('apple')!.hasAttribute('data-highlighted')).toBe(true);

		await fireEvent.keyDown(list, { key: 'Enter' });
		expect(onValueChange).toHaveBeenCalledWith({
			value: ['apple'],
			items: [{ value: 'apple', label: 'Apple' }]
		});
		expect(item('apple')!.getAttribute('data-state')).toBe('checked');
	});

	test('typeahead highlights matches, cycles repeats and skips disabled items', async () => {
		render(Phase5Listbox, { props: {} });

		const list = content()!;
		list.focus();
		await tick();

		// Focusing highlighted Apple, and a single character cycles past the current item.
		await fireEvent.keyDown(list, { key: 'a' });
		expect(item('apricot')!.hasAttribute('data-highlighted')).toBe(true);
		await fireEvent.keyDown(list, { key: 'a' });
		expect(item('apple')!.hasAttribute('data-highlighted')).toBe(true);

		await resetTypeahead();

		await fireEvent.keyDown(list, { key: 'b' });
		expect(item('banana')!.hasAttribute('data-highlighted')).toBe(true);

		await resetTypeahead();

		// Cherry is disabled, so "c" lands on Carrot in the next group.
		await fireEvent.keyDown(list, { key: 'c' });
		expect(item('carrot')!.hasAttribute('data-highlighted')).toBe(true);
		expect(item('cherry')!.hasAttribute('data-highlighted')).toBe(false);

		await resetTypeahead();

		// Keys typed in sequence accumulate into one prefix.
		await fireEvent.keyDown(list, { key: 'd' });
		expect(item('daikon')!.hasAttribute('data-highlighted')).toBe(true);
		await fireEvent.keyDown(list, { key: 'a' });
		expect(item('daikon')!.hasAttribute('data-highlighted')).toBe(true);
	});

	test('supports multiple selection with aria-multiselectable and ctrl+a', async () => {
		const onValueChange = vi.fn();
		render(Phase5Listbox, { props: { selectionMode: 'multiple', onValueChange } });

		expect(content()!.getAttribute('aria-multiselectable')).toBe('true');

		await fireEvent.click(item('apple')!);
		await fireEvent.click(item('daikon')!);

		expect(item('apple')!.getAttribute('data-state')).toBe('checked');
		expect(item('daikon')!.getAttribute('data-state')).toBe('checked');
		expect(onValueChange.mock.calls[1][0].value).toEqual(['apple', 'daikon']);
		expect($('[data-part="value-text"]')!.textContent?.trim()).toBe('Apple, Daikon');

		const list = content()!;
		list.focus();
		await fireEvent.keyDown(list, { key: 'a', ctrlKey: true });
		expect(onValueChange.mock.calls.at(-1)![0].value).toEqual([
			'apple',
			'apricot',
			'banana',
			'cherry',
			'carrot',
			'daikon'
		]);
	});

	test('ignores pointer interaction with a disabled item', async () => {
		const onValueChange = vi.fn();
		render(Phase5Listbox, { props: { onValueChange } });

		const cherry = item('cherry')!;
		expect(cherry.hasAttribute('data-disabled')).toBe(true);
		expect(cherry.getAttribute('aria-disabled')).toBe('true');

		await fireEvent.click(cherry);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(cherry.getAttribute('data-state')).toBe('unchecked');
	});

	test('renders the empty part only for an empty collection', async () => {
		const { unmount } = render(Phase5Listbox, { props: { groups: [] } });
		expect($('[data-part="empty"]')!.textContent?.trim()).toBe('Nothing matches.');
		expect($('[data-part="empty"]')!.getAttribute('role')).toBe('presentation');
		expect(content()!.hasAttribute('data-empty')).toBe(true);
		unmount();

		render(Phase5Listbox, { props: {} });
		expect($('[data-part="empty"]')).toBeNull();
	});

	test('clears the search input from the clear trigger', async () => {
		render(Phase5Listbox, { props: {} });

		const input = $<HTMLInputElement>('[data-part="input"]')!;
		expect(input.getAttribute('data-slot')).toBe('listbox-input');
		expect(input.getAttribute('aria-controls')).toBe('listbox-content');
		expect(input.getAttribute('aria-haspopup')).toBe('listbox');

		input.value = 'ban';
		await fireEvent.input(input);

		const clear = $('[data-part="clear-trigger"]')!;
		expect(clear.getAttribute('data-slot')).toBe('listbox-clear-trigger');
		expect(clear.getAttribute('aria-label')).toBe('Clear search');

		await fireEvent.click(clear);
		expect(input.value).toBe('');
	});
});
