import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase4Menu from './harness/Phase4Menu.svelte';
import Phase4MenuContext from './harness/Phase4MenuContext.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const trigger = () => $('[data-scope="menu"][data-part="trigger"]')!;
const content = () => $('[data-scope="menu"][data-part="content"]');
const item = (value: string) => $(`[data-part="item"][data-value="${value}"]`)!;
const itemIds = () => $$('[data-part="item"]').map((node) => node.getAttribute('data-value'));
const highlightedId = () => content()?.getAttribute('aria-activedescendant');

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Content leaves the DOM only after the exit animation settles, so wait instead of asserting once. */
const closed = () => waitFor(() => expect(content()).toBeNull());

async function open(props: Record<string, unknown> = {}) {
	render(Phase4Menu, { props });
	await fireEvent.click(trigger());
	await settle();
	const node = content();
	if (!node) throw new Error('menu content did not mount');
	return node;
}

const key = (node: HTMLElement, name: string) => fireEvent.keyDown(node, { key: name });

describe('Menu', () => {
	test('renders the Zag trigger contract and keeps closed content unmounted', () => {
		render(Phase4Menu);

		expect(trigger().getAttribute('data-scope')).toBe('menu');
		expect(trigger().getAttribute('data-part')).toBe('trigger');
		expect(trigger().getAttribute('data-slot')).toBe('menu-trigger');
		expect(trigger().getAttribute('type')).toBe('button');
		expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
		expect(trigger().getAttribute('data-state')).toBe('closed');
		expect($('[data-scope="menu"][data-part="indicator"]')).not.toBeNull();
		expect(content()).toBeNull();
	});

	test('opens on click with Zag ids, roles and grouped items', async () => {
		const onOpenChange = vi.fn();
		const node = await open({ onOpenChange });

		expect(onOpenChange).toHaveBeenCalledWith({ open: true });
		expect(trigger().getAttribute('aria-expanded')).toBe('true');
		expect(trigger().getAttribute('data-state')).toBe('open');

		const rootId = node.id.replace(/^menu:(.*):content$/, '$1');
		expect(node.id).toBe(`menu:${rootId}:content`);
		expect(trigger().id).toBe(`menu:${rootId}:trigger`);
		expect(trigger().getAttribute('aria-controls')).toBe(node.id);
		expect(trigger().getAttribute('data-controls')).toBe(node.id);
		expect(node.getAttribute('role')).toBe('menu');
		expect(node.getAttribute('aria-label')).toBe('Actions');
		expect(node.getAttribute('data-state')).toBe('open');
		expect(node.tabIndex).toBe(0);
		expect(node.hasAttribute('hidden')).toBe(false);

		const undo = item('undo');
		expect(undo.id).toBe(`${rootId}/undo`);
		expect(undo.getAttribute('role')).toBe('menuitem');
		expect(undo.getAttribute('data-ownedby')).toBe(node.id);

		const group = $('[data-part="item-group"]')!;
		const label = $('[data-part="item-group-label"]')!;
		expect(group.id).toBe(`menu:${rootId}:group:edit`);
		expect(group.getAttribute('role')).toBe('group');
		expect(group.getAttribute('aria-labelledby')).toBe(label.id);
		expect(label.id).toBe(`menu:${rootId}:group-label:edit`);
		expect($('[data-part="separator"]')!.getAttribute('role')).toBe('separator');
		expect(item('redo').getAttribute('data-disabled')).toBe('');
		expect(item('redo').getAttribute('aria-disabled')).toBe('true');
		expect($('[data-part="arrow"]')).not.toBeNull();
		expect($('[data-part="arrow-tip"]')).not.toBeNull();
	});

	test('ArrowDown opens and highlights, arrows and Home/End move, aria-activedescendant follows', async () => {
		render(Phase4Menu);
		trigger().focus();

		await key(trigger(), 'ArrowDown');
		await settle();

		const node = content()!;
		expect(document.activeElement).toBe(node);
		expect(item('undo').getAttribute('data-highlighted')).toBe('');
		expect(highlightedId()).toBe(item('undo').id);

		await key(node, 'ArrowDown');
		await settle();
		expect(item('redo').hasAttribute('data-highlighted')).toBe(false);
		expect(item('wrap').getAttribute('data-highlighted')).toBe('');
		expect(highlightedId()).toBe(item('wrap').id);

		await key(node, 'End');
		await settle();
		expect(highlightedId()).toBe($('[data-part="trigger-item"]')!.id);

		await key(node, 'Home');
		await settle();
		expect(highlightedId()).toBe(item('undo').id);

		await key(node, 'ArrowUp');
		await settle();
		expect(highlightedId()).toBeNull();
		expect(item('undo').hasAttribute('data-highlighted')).toBe(false);
	});

	test('typeahead highlights by label and cycles repeated characters', async () => {
		const node = await open();

		await key(node, 'c');
		await settle();
		expect(item('compact').getAttribute('data-highlighted')).toBe('');

		await key(node, 'c');
		await settle();
		expect(item('comfortable').getAttribute('data-highlighted')).toBe('');

		await key(node, 'c');
		await settle();
		expect(item('compact').getAttribute('data-highlighted')).toBe('');

		await new Promise((resolve) => setTimeout(resolve, 400));
		await key(node, 'd');
		await settle();
		expect(item('delete').getAttribute('data-highlighted')).toBe('');
	});

	test('hovering an item highlights it', async () => {
		const node = await open();

		await fireEvent.pointerMove(item('undo'), { pointerType: 'mouse' });
		await settle();
		expect(item('undo').getAttribute('data-highlighted')).toBe('');

		await fireEvent.pointerMove(item('delete'), { pointerType: 'mouse' });
		await settle();
		expect(item('delete').getAttribute('data-highlighted')).toBe('');
		expect(item('undo').hasAttribute('data-highlighted')).toBe(false);

		await fireEvent.pointerLeave(item('delete'), { pointerType: 'mouse' });
		await settle();
		expect(item('delete').hasAttribute('data-highlighted')).toBe(false);
	});

	test('Enter selects the highlighted item, closes the menu and restores focus', async () => {
		const onSelect = vi.fn();
		const onOpenChange = vi.fn();
		render(Phase4Menu, { props: { onSelect, onOpenChange } });
		trigger().focus();
		await key(trigger(), 'ArrowDown');
		await settle();
		await key(content()!, 'ArrowDown');
		await settle();

		await key(content()!, 'Enter');
		await settle();

		expect(onSelect).toHaveBeenCalledWith({
			value: 'wrap',
			modifiers: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }
		});
		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		await closed();
		await waitFor(() => expect(document.activeElement).toBe(trigger()));
	});

	test('closeOnSelect={false} keeps the menu open after a click', async () => {
		const onSelect = vi.fn();
		render(Phase4Menu, { props: { onSelect, closeOnSelect: false } });
		await fireEvent.click(trigger());
		await settle();

		await fireEvent.click(item('undo'));
		await settle();

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(content()).not.toBeNull();
		expect(item('undo').getAttribute('data-highlighted')).toBe('');
	});

	test('disabled items never select, and pointer or focus outside dismisses', async () => {
		const onSelect = vi.fn();
		render(Phase4Menu, { props: { onSelect } });
		await fireEvent.click(trigger());
		await settle();

		await fireEvent.click(item('redo'));
		expect(onSelect).not.toHaveBeenCalled();
		expect(content()).not.toBeNull();

		await fireEvent.pointerDown(document.body);
		await closed();
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
	});

	test('focus moving outside dismisses the menu', async () => {
		const node = await open();
		const outside = document.createElement('button');
		document.body.appendChild(outside);

		outside.focus();
		await closed();

		expect(node.isConnected).toBe(false);
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
		outside.remove();
	});

	test('Escape closes without selecting', async () => {
		const onSelect = vi.fn();
		const node = await open({ onSelect });

		await fireEvent.keyDown(node, { key: 'Escape' });
		await settle();

		expect(onSelect).not.toHaveBeenCalled();
		await closed();
		expect(trigger().getAttribute('data-state')).toBe('closed');
	});

	test('checkbox and radio items report checked state', async () => {
		const node = await open({ closeOnSelect: false });

		const checkbox = $('[data-part="item"][data-value="wrap"]')!;
		expect(checkbox.getAttribute('role')).toBe('menuitemcheckbox');
		expect(checkbox.getAttribute('aria-checked')).toBe('false');
		expect(checkbox.getAttribute('data-state')).toBe('unchecked');
		const checkIndicator = checkbox.querySelector('[data-part="item-indicator"]') as HTMLElement;
		expect(checkIndicator.getAttribute('data-state')).toBe('unchecked');
		expect(checkIndicator.hasAttribute('hidden')).toBe(true);

		await fireEvent.click(checkbox);
		await settle();
		expect(checkbox.getAttribute('aria-checked')).toBe('true');
		expect(checkbox.querySelector('[data-part="item-indicator"]')!.hasAttribute('hidden')).toBe(
			false
		);

		const group = $('[data-part="item-group"][data-slot="menu-radio-item-group"]')!;
		const compact = $('[data-part="item"][data-value="compact"]')!;
		const comfortable = $('[data-part="item"][data-value="comfortable"]')!;
		expect(group.getAttribute('role')).toBe('group');
		expect(compact.getAttribute('role')).toBe('menuitemradio');
		expect(compact.getAttribute('aria-checked')).toBe('true');
		expect(comfortable.getAttribute('aria-checked')).toBe('false');

		await fireEvent.click(comfortable);
		await settle();
		expect(comfortable.getAttribute('aria-checked')).toBe('true');
		expect(comfortable.getAttribute('data-state')).toBe('checked');
		expect(compact.getAttribute('aria-checked')).toBe('false');
		expect(itemIds()).toContain('comfortable');
		expect(node.getAttribute('aria-label')).toBe('Actions');
	});

	test('the submenu trigger item opens its own menu on ArrowRight', async () => {
		const node = await open();
		const triggerItem = $('[data-part="trigger-item"]')!;
		expect(triggerItem.getAttribute('role')).toBe('menuitem');
		expect(triggerItem.getAttribute('aria-haspopup')).toBe('menu');
		expect(triggerItem.getAttribute('aria-expanded')).toBe('false');
		expect(triggerItem.hasAttribute('data-controls')).toBe(true);

		await key(node, 'End');
		await settle();
		expect(node.getAttribute('aria-activedescendant')).toBe(triggerItem.id);

		await key(node, 'ArrowRight');
		await settle();

		const submenu = $('[data-scope="menu"][data-part="content"][aria-label="Share"]')!;
		expect(submenu).not.toBeNull();
		expect(triggerItem.getAttribute('aria-expanded')).toBe('true');
		expect(submenu.getAttribute('role')).toBe('menu');
		expect(submenu.querySelectorAll('[role="menuitem"]')).toHaveLength(2);

		await key(submenu, 'ArrowLeft');
		await waitFor(() =>
			expect($('[data-scope="menu"][data-part="content"][aria-label="Share"]')).toBeNull()
		);
		expect(content()).not.toBeNull();
		expect(triggerItem.getAttribute('aria-expanded')).toBe('false');
		await waitFor(() => expect(document.activeElement).toBe(content()));
	});

	test('the context trigger opens on contextmenu and positions from the pointer', async () => {
		const onOpenChange = vi.fn();
		render(Phase4MenuContext, { props: { onOpenChange } });

		const contextTrigger = $('[data-scope="menu"][data-part="context-trigger"]')!;
		expect(contextTrigger.getAttribute('data-state')).toBe('closed');
		expect(contextTrigger.hasAttribute('data-current')).toBe(false);

		await fireEvent.contextMenu(contextTrigger, { clientX: 40, clientY: 60 });
		await settle();

		expect(onOpenChange).toHaveBeenCalledWith({ open: true });
		const node = content()!;
		expect(node.getAttribute('aria-labelledby')).toBe(contextTrigger.id);
		expect(contextTrigger.id).toMatch(/ctx-trigger$/);
		expect(contextTrigger.getAttribute('data-state')).toBe('open');
		expect($('[data-scope="menu"][data-part="positioner"]')!.id).toMatch(/menu:.*:popper$/);
	});
});
