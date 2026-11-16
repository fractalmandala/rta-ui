import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase5Combobox from './harness/Phase5Combobox.svelte';
import Phase5ComboboxProvider from './harness/Phase5ComboboxProvider.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector<T>(selector);
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const root = () => $('[data-scope="combobox"][data-part="root"]')!;
const rootId = () => root().getAttribute('id')!;
const input = () => $<HTMLInputElement>('[data-part="input"]')!;
const trigger = () => $<HTMLButtonElement>('[data-part="trigger"]')!;
const content = () => $('[data-part="content"]');
const options = () => $$('[data-part="item"]');
const valuesOf = () => options().map((node) => node.getAttribute('data-value'));
const hiddenInputs = () => $$('input[type="hidden"][name="fruit"]') as HTMLInputElement[];
const highlightedValues = () =>
	$$('[data-part="item"][data-highlighted]').map((node) => node.getAttribute('data-value'));

const openWithTrigger = async () => {
	await fireEvent.click(trigger());
	await waitFor(() => expect(content()).not.toBeNull());
};

const type = async (text: string) => {
	const node = input();
	node.focus();
	await fireEvent.focus(node);
	await fireEvent.input(node, { target: { value: text } });
	await waitFor(() => expect(content()).not.toBeNull());
};

const press = async (key: string, node: HTMLElement = input()) =>
	fireEvent.keyDown(node, { key });

/** Dispatches a cancellable keydown and reports whether the component claimed it. */
const keyProbe = async (key: string, node: HTMLElement = input()) => {
	const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
	node.dispatchEvent(event);
	await tick();
	return event.defaultPrevented;
};

describe('Combobox', () => {
	test('emits the Zag anatomy hooks and the combobox aria contract', () => {
		render(Phase5Combobox, { props: {} });

		expect(root().getAttribute('data-slot')).toBe('combobox-root');
		expect($('[data-part="label"]')!.getAttribute('data-slot')).toBe('combobox-label');
		expect($('[data-part="control"]')!.getAttribute('data-slot')).toBe('combobox-control');
		expect(input().getAttribute('data-slot')).toBe('combobox-input');
		expect(trigger().getAttribute('data-slot')).toBe('combobox-trigger');
		expect($('[data-part="clear-trigger"]')!.getAttribute('data-slot')).toBe(
			'combobox-clear-trigger'
		);

		expect(input().getAttribute('role')).toBe('combobox');
		expect(input().id).toBe(`${rootId()}:input`);
		expect(input().getAttribute('aria-controls')).toBe(`${rootId()}:content`);
		expect(input().getAttribute('aria-expanded')).toBe('false');
		expect(input().getAttribute('aria-autocomplete')).toBe('list');
		expect(input().getAttribute('type')).toBe('text');

		expect(trigger().id).toBe(`${rootId()}:toggle-btn`);
		expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
		expect(trigger().getAttribute('aria-label')).toBe('Toggle suggestions');

		expect($('[data-part="label"]')!.getAttribute('for')).toBe(input().id);
		expect($('[data-part="clear-trigger"]')!.hasAttribute('hidden')).toBe(true);
		expect(content()).toBeNull();
	});

	test('opens on input, click and focus, portals the content and dismisses outside', async () => {
		const first = render(Phase5Combobox, { props: {} });

		await type('an');
		expect(input().getAttribute('aria-expanded')).toBe('true');
		expect(content()!.getAttribute('role')).toBe('listbox');
		expect(content()!.getAttribute('data-state')).toBe('open');
		expect(content()!.parentElement?.getAttribute('data-part')).toBe('positioner');
		expect(root().contains(content())).toBe(false);
		expect(valuesOf()).toEqual(['banana', 'mango']);
		expect(options()[0].id).toBe(`${rootId()}:option:banana`);
		expect(options()[0].getAttribute('role')).toBe('option');
		expect(options()[0].getAttribute('aria-selected')).toBe('false');
		expect($('[data-part="list"]')!.getAttribute('data-slot')).toBe('combobox-list');
		expect($('[data-part="item-text"]')!.getAttribute('data-slot')).toBe('combobox-item-text');

		await fireEvent.pointerDown(document.body);
		await waitFor(() => expect(input().getAttribute('aria-expanded')).toBe('false'));
		expect(input().value).toBe('');

		await openWithTrigger();
		expect(input().getAttribute('aria-expanded')).toBe('true');
		expect(trigger().getAttribute('aria-controls')).toBe(`${rootId()}:content`);

		first.unmount();

		const second = render(Phase5Combobox, { props: { openOnClick: true } });
		await fireEvent.click(input());
		await waitFor(() => expect(input().getAttribute('aria-expanded')).toBe('true'));
		second.unmount();

		render(Phase5Combobox, { props: { openOnFocus: true } });
		input().focus();
		await fireEvent.focus(input());
		await waitFor(() => expect(input().getAttribute('aria-expanded')).toBe('true'));
		expect(options()).toHaveLength(5);
	});

	test('narrows items through onInputValueChange and renders the empty state', async () => {
		const onInputValueChange = vi.fn();
		render(Phase5Combobox, { props: { onInputValueChange } });

		await type('pap');
		expect(onInputValueChange).toHaveBeenCalledWith(
			expect.objectContaining({ inputValue: 'pap', reason: 'input-change' })
		);
		expect(valuesOf()).toEqual(['papaya']);

		await fireEvent.input(input(), { target: { value: 'zzz' } });
		await waitFor(() => expect(options()).toHaveLength(0));
		expect($('[data-part="empty"]')!.getAttribute('data-slot')).toBe('combobox-empty');
		expect($('[data-part="empty"]')!.textContent?.trim()).toBe('No fruits found.');
		expect($('[data-part="list"]')!.hasAttribute('data-empty')).toBe(true);
		expect(content()!.hasAttribute('data-empty')).toBe(true);
	});

	test('navigates with arrows, Home and End, then selects with Enter or Space', async () => {
		const onValueChange = vi.fn();
		render(Phase5Combobox, { props: { onValueChange } });

		await openWithTrigger();
		expect(highlightedValues()).toEqual(['apple']);
		expect(input().getAttribute('aria-activedescendant')).toBe(`${rootId()}:option:apple`);

		expect(await keyProbe('ArrowDown')).toBe(true);
		expect(highlightedValues()).toEqual(['banana']);

		await press('End');
		expect(highlightedValues()).toEqual(['papaya']);

		await press('Home');
		expect(highlightedValues()).toEqual(['apple']);

		await press('ArrowUp');
		expect(highlightedValues()).toEqual(['papaya']);

		await press('ArrowDown');
		expect(highlightedValues()).toEqual(['apple']);

		await press('Enter');
		expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }));
		expect(input().value).toBe('Apple');
		expect(input().getAttribute('aria-expanded')).toBe('false');
		expect(input().hasAttribute('aria-activedescendant')).toBe(false);
		expect(input().getAttribute('name')).toBe('fruit');

		const kiwi = options().find((node) => node.getAttribute('data-value') === 'kiwi')!;
		expect(kiwi.getAttribute('aria-disabled')).toBe('true');
		await fireEvent.click(kiwi);
		expect(options().filter((node) => node.hasAttribute('data-highlighted'))).toHaveLength(0);

		// Closed again, so Enter is left to the surrounding form.
		expect(await keyProbe('Enter')).toBe(false);

		await fireEvent.keyDown(options()[2], { key: ' ' });
		expect(input().value).toBe('Mango');

		const clear = $<HTMLButtonElement>('[data-part="clear-trigger"]')!;
		expect(clear.hasAttribute('hidden')).toBe(false);
		await fireEvent.click(clear);
		await waitFor(() => expect(input().value).toBe(''));
		expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: [] }));
		expect(clear.hasAttribute('hidden')).toBe(true);
	});

	test('closes on Escape, reverts custom input, and commits it with allowCustomValue', async () => {
		const first = render(Phase5Combobox, { props: {} });

		await type('bananas');
		expect(input().value).toBe('bananas');

		await press('Escape');
		await waitFor(() => expect(input().getAttribute('aria-expanded')).toBe('false'));
		expect(input().value).toBe('bananas');

		await press('Escape');
		await waitFor(() => expect(input().value).toBe(''));

		first.unmount();

		render(Phase5Combobox, { props: { allowCustomValue: true } });
		await type('dragonfruit');
		await press('Tab');
		await waitFor(() => expect(input().getAttribute('aria-expanded')).toBe('false'));
		expect(input().value).toBe('dragonfruit');
	});

	test('selects several items, submits hidden inputs and removes a chip', async () => {
		render(Phase5Combobox, { props: { mode: 'multiple' } });

		await openWithTrigger();
		await fireEvent.click(options()[0]);
		await fireEvent.click(options()[1]);

		expect(hiddenInputs().map((node) => node.value)).toEqual(['apple', 'banana']);
		expect(input().hasAttribute('name')).toBe(false);
		expect(input().getAttribute('aria-expanded')).toBe('true');
		expect(content()!.getAttribute('aria-multiselectable')).toBe('true');
		expect(options()[0].getAttribute('aria-selected')).toBe('true');
		expect(input().value).toBe('');

		expect($$('[data-testid="chip"]')).toHaveLength(2);
		await fireEvent.click($('[data-testid="chip-remove"]')!);
		await waitFor(() => expect(hiddenInputs().map((node) => node.value)).toEqual(['banana']));
	});

	test('groups items with the Zag optgroup id scheme and types ahead when the list is static', async () => {
		const first = render(Phase5Combobox, { props: { mode: 'groups' } });
		await openWithTrigger();

		const group = $('[data-part="item-group"][id$="optgroup:Europe"]')!;
		expect(group.getAttribute('id')).toBe(`${rootId()}:optgroup:Europe`);
		expect(group.getAttribute('role')).toBe('group');
		const label = document.getElementById(`${rootId()}:optgroup-label:Europe`)!;
		expect(label.getAttribute('data-slot')).toBe('combobox-item-group-label');
		expect(label.getAttribute('role')).toBe('presentation');
		expect(group.getAttribute('aria-labelledby')).toBe(label.getAttribute('id'));
		expect(valuesOf()).toEqual(['ca', 'us', 'de', 'fr']);
		expect($('[data-part="item-indicator"]')!.hasAttribute('hidden')).toBe(true);

		first.unmount();

		render(Phase5Combobox, { props: { mode: 'static' } });
		await openWithTrigger();
		expect(highlightedValues()).toEqual(['apple']);
		await press('p');
		expect(highlightedValues()).toEqual(['papaya']);
		await press('m');
		expect(highlightedValues()).toEqual(['mango']);
		expect(options()).toHaveLength(5);
	});

	test('drives createCombobox defaults and a controlled value through RootProvider', async () => {
		const first = render(Phase5ComboboxProvider, { props: { defaultInputValue: 'Man' } });

		expect(root().getAttribute('data-slot')).toBe('combobox-root-provider');
		expect(root().getAttribute('id')).toBe('combobox:phase5-provider');
		expect(input().value).toBe('Man');
		expect(hiddenInputs().map((node) => node.value)).toEqual(['mango']);

		await fireEvent.click($('[data-testid="api-open"]')!);
		await waitFor(() => expect(content()).not.toBeNull());
		expect(input().getAttribute('aria-expanded')).toBe('true');

		await fireEvent.click($('[data-testid="api-input"]')!);
		await waitFor(() => expect(input().value).toBe('pap'));

		await fireEvent.click($('[data-testid="api-clear"]')!);
		await waitFor(() => expect(hiddenInputs()).toHaveLength(0));

		await fireEvent.click($('[data-testid="api-close"]')!);
		await waitFor(() => expect(input().getAttribute('aria-expanded')).toBe('false'));

		first.unmount();

		const onValueChange = vi.fn();
		render(Phase5ComboboxProvider, { props: { value: ['apple'], onValueChange } });

		expect(hiddenInputs().map((node) => node.value)).toEqual(['apple']);
		await openWithTrigger();
		await fireEvent.click(options()[1]);

		expect(onValueChange).toHaveBeenCalledWith(
			expect.objectContaining({ value: ['apple', 'mango'] })
		);
		// The consumer kept the frozen `value`, so the selection does not move.
		expect(hiddenInputs().map((node) => node.value)).toEqual(['apple']);
	});
});
