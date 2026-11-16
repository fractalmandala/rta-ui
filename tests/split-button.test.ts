import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase4SplitButton from './harness/Phase4SplitButton.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

const root = () => $('[data-scope="split-button"][data-part="root"]')!;
const action = () => $('[data-slot="split-button-action"]')!;
const trigger = () => $('[data-slot="split-button-trigger"]')!;
const content = () => $('[data-slot="split-button-content"]');
const positioner = () => $('[data-slot="split-button-positioner"]');
const item = (value: string) => $(`[data-part="item"][data-value="${value}"]`)!;

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('SplitButton', () => {
	test('composes a group of a Button action and an attached menu trigger', () => {
		render(Phase4SplitButton);

		expect(root().getAttribute('role')).toBe('group');
		expect(root().getAttribute('aria-label')).toBe('Document');
		expect(root().getAttribute('data-slot')).toBe('split-button-root');

		const button = action();
		expect(button.tagName).toBe('BUTTON');
		expect(button.getAttribute('data-scope')).toBe('button');
		expect(button.getAttribute('data-slot')).toBe('split-button-action');
		expect(button.getAttribute('data-size')).toBe('md');
		expect(button.getAttribute('data-variant')).toBe('default');
		expect(button.textContent).toContain('Save');

		const menuTrigger = trigger();
		expect(menuTrigger.tagName).toBe('BUTTON');
		expect(menuTrigger.getAttribute('data-slot')).toBe('split-button-trigger');
		expect(menuTrigger.getAttribute('aria-haspopup')).toBe('menu');
		expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
		expect(menuTrigger.getAttribute('aria-label')).toBe('More actions');
		expect(menuTrigger.getAttribute('data-size')).toBe('md');
		expect(menuTrigger.getAttribute('data-variant')).toBe('default');
		expect(content()).toBeNull();
	});

	test('the shared size and variant reach both buttons', () => {
		render(Phase4SplitButton, { props: { size: 'sm', variant: 'outline' } });

		expect(action().getAttribute('data-size')).toBe('sm');
		expect(action().getAttribute('data-variant')).toBe('outline');
		expect(trigger().getAttribute('data-size')).toBe('sm');
		expect(trigger().getAttribute('data-variant')).toBe('outline');
	});

	test('the attached trigger opens the menu family content in its own positioner', async () => {
		render(Phase4SplitButton);

		await fireEvent.click(trigger());
		await waitFor(() => expect(content()).not.toBeNull());

		const node = content()!;
		expect(trigger().getAttribute('aria-expanded')).toBe('true');
		expect(trigger().getAttribute('aria-controls')).toBe(node.id);
		expect(node.id).toMatch(/^menu:.*:content$/);
		expect(node.getAttribute('role')).toBe('menu');
		expect(node.getAttribute('aria-label')).toBe('Save options');
		expect(node.getAttribute('data-placement')).toBe('bottom-end');
		expect(positioner()).not.toBeNull();
		expect(positioner()!.id).toMatch(/^menu:.*:popper$/);
		expect($('[data-scope="menu"][data-part="viewport"]')!.closest('[data-slot="split-button-content"]')).toBe(node);

		const first = item('save-as');
		expect(first.getAttribute('role')).toBe('menuitem');
		expect($('[data-slot="menu-item-shortcut"]')).not.toBeNull();
		expect(item('archive').getAttribute('data-disabled')).toBe('');
	});

	test('selecting an item closes the menu, reports the value and restores focus to the trigger', async () => {
		const onSelect = vi.fn();
		const onOpenChange = vi.fn();
		render(Phase4SplitButton, { props: { onSelect, onOpenChange } });

		await fireEvent.click(trigger());
		await waitFor(() => expect(content()).not.toBeNull());

		await fireEvent.click(item('export'));
		expect(onSelect).toHaveBeenCalledWith({
			value: 'export',
			modifiers: { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }
		});
		expect(onOpenChange).toHaveBeenCalledWith({ open: false });
		await waitFor(() => expect(content()).toBeNull());
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
		await waitFor(() => expect(document.activeElement).toBe(trigger()));
	});

	test('the main action is independent of the menu', async () => {
		const onAction = vi.fn();
		render(Phase4SplitButton, { props: { onAction } });

		await fireEvent.click(action());
		await settle();

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(content()).toBeNull();
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
	});

	test('disabling the action does not affect the menu, and a disabled trigger cannot open it', async () => {
		const onAction = vi.fn();
		const onOpenChange = vi.fn();
		render(Phase4SplitButton, {
			props: { actionDisabled: true, onAction, onOpenChange, triggerDisabled: true }
		});

		await fireEvent.click(action());
		expect(onAction).not.toHaveBeenCalled();
		expect(action().getAttribute('data-disabled')).toBe('');
		expect(action().getAttribute('aria-disabled')).toBe('true');

		await fireEvent.click(trigger());
		await settle();

		expect(onOpenChange).not.toHaveBeenCalled();
		expect(content()).toBeNull();
		expect(trigger().getAttribute('aria-expanded')).toBe('false');
		expect(trigger().getAttribute('data-disabled')).toBe('');
	});
});
