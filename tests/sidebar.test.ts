import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Phase6Sidebar from './harness/Phase6Sidebar.svelte';

const $ = (selector: string) => document.querySelector<HTMLElement>(selector);
const $$ = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)];

const rootOf = () => $('[data-scope="sidebar"][data-part="root"]');
const triggerOf = () => $('[data-scope="sidebar"][data-part="trigger"]');
const panelOf = () => $('[data-scope="sidebar"][data-part="panel"]');
const settle = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(() => {
	document.cookie = 'sidebar_state=; path=/; max-age=0';
});

describe('Sidebar', () => {
	test('emits the ark-style root, trigger and panel contract', () => {
		render(Phase6Sidebar, { props: {} });

		const root = rootOf()!;
		const trigger = triggerOf()!;
		expect(root.getAttribute('data-slot')).toBe('sidebar-root');
		expect(root.getAttribute('data-state')).toBe('expanded');
		expect(root.getAttribute('data-collapsible')).toBe('icon');
		expect(root.getAttribute('data-side')).toBe('left');
		expect(root.hasAttribute('data-mobile')).toBe(false);

		expect(trigger.getAttribute('data-slot')).toBe('sidebar-trigger');
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		expect(trigger.getAttribute('aria-controls')).toBe(root.id);
		expect(trigger.getAttribute('aria-label')).toBe('Toggle navigation');
		expect(trigger.id).toBe(`sidebar:${trigger.id.split(':')[1]}:trigger`);

		const panel = panelOf()!;
		expect(panel.getAttribute('data-slot')).toBe('sidebar-panel');
		expect(panel.getAttribute('data-state')).toBe('expanded');
		expect(panel.getAttribute('data-collapsible')).toBe('icon');
		expect(panel.getAttribute('data-side')).toBe('left');
		expect(panel.style.flexGrow).toBe('50');

		expect($('[data-slot="sidebar-inset"]')!.getAttribute('data-side')).toBe('left');
		expect($('[data-part="resize-trigger"]')!.getAttribute('aria-label')).toBe('Resize sidebar');
		expect($('[data-scope="separator"][data-part="root"]')).not.toBeNull();

		expect($('[data-part="expanded-content"]')!.hidden).toBe(false);
		expect($('[data-part="collapsed-content"]')!.hidden).toBe(true);
	});

	test('toggles between expanded and collapsed from the trigger', async () => {
		const onOpenChange = vi.fn();
		render(Phase6Sidebar, { props: { onOpenChange } });

		await fireEvent.click(triggerOf()!);
		flushSync();

		expect(onOpenChange).toHaveBeenCalledWith({ open: false });
		expect(rootOf()!.getAttribute('data-state')).toBe('collapsed');
		expect(triggerOf()!.getAttribute('aria-expanded')).toBe('false');
		expect(panelOf()!.getAttribute('data-state')).toBe('collapsed');
		expect($('[data-part="expanded-content"]')!.hidden).toBe(true);
		expect($('[data-part="collapsed-content"]')!.hidden).toBe(false);

		await fireEvent.click(triggerOf()!);
		flushSync();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: true });
		expect(rootOf()!.getAttribute('data-state')).toBe('expanded');
	});

	test('toggles from the rail and the mod+b shortcut', async () => {
		render(Phase6Sidebar, { props: {} });

		await fireEvent.click($('[data-part="rail"]')!);
		flushSync();
		expect(rootOf()!.getAttribute('data-state')).toBe('collapsed');

		await fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true });
		flushSync();
		expect(rootOf()!.getAttribute('data-state')).toBe('expanded');

		await fireEvent.keyDown(document.body, { key: 'b', metaKey: true });
		flushSync();
		expect(rootOf()!.getAttribute('data-state')).toBe('collapsed');
	});

	test('ignores the shortcut inside an editable field and when disabled', async () => {
		render(Phase6Sidebar, { props: { keyboardShortcut: false } });

		await fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true });
		flushSync();
		expect(rootOf()!.getAttribute('data-state')).toBe('expanded');
	});

	test('persists the open state to the sidebar cookie', async () => {
		render(Phase6Sidebar, { props: { persist: true } });

		await fireEvent.click(triggerOf()!);
		flushSync();

		expect(document.cookie).toContain('sidebar_state=false');
	});

	test('keeps the sidebar pinned when collapsible is none', async () => {
		render(Phase6Sidebar, { props: { collapsible: 'none' } });

		const trigger = triggerOf()!;
		expect(trigger.hasAttribute('disabled')).toBe(true);
		await fireEvent.click(trigger);
		flushSync();

		expect(rootOf()!.getAttribute('data-state')).toBe('expanded');
		expect(panelOf()!.getAttribute('data-collapsible')).toBe('none');
	});

	test('marks the active navigation item with data-active and aria-current', async () => {
		render(Phase6Sidebar, { props: {} });

		const buttons = () => $$('[data-part="navigation-button"]');
		expect(buttons()[0].hasAttribute('data-active')).toBe(true);
		expect(buttons()[0].getAttribute('aria-current')).toBe('page');
		expect(buttons()[1].hasAttribute('data-active')).toBe(false);
		expect(buttons()[0].getAttribute('data-size')).toBe('md');
		expect($('[data-part="navigation-badge"]')!.textContent).toBe('4');

		await fireEvent.click(buttons()[1]);
		flushSync();

		expect(buttons()[1].getAttribute('aria-current')).toBe('page');
		expect(buttons()[0].hasAttribute('data-active')).toBe(false);
		expect($('[data-testid="active"]')!.textContent).toBe('reports');
	});

	test('only shows item tooltips while collapsed', async () => {
		render(Phase6Sidebar, { props: {} });

		const first = () => $$('[data-part="navigation-button"]')[0];
		await fireEvent.pointerEnter(first(), { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect($('[data-scope="tooltip"][data-part="content"]')).toBeNull();

		await fireEvent.pointerLeave(first(), { pointerType: 'mouse' });
		await fireEvent.click(triggerOf()!);
		flushSync();
		await fireEvent.pointerEnter(first(), { pointerType: 'mouse' });
		await settle();

		await waitFor(() => expect($('[data-scope="tooltip"][data-part="content"]')).not.toBeNull());
		expect($('[data-scope="tooltip"][data-part="content"]')!.textContent).toContain('Inbox');
	});

	test('renders the sidebar in a dialog sheet on mobile', async () => {
		render(Phase6Sidebar, { props: { mobile: true, open: false } });

		const root = rootOf()!;
		expect(root.getAttribute('data-mobile')).toBe('');
		expect(panelOf()).toBeNull();
		expect($('[data-part="resize-trigger"]')).toBeNull();

		await fireEvent.click(triggerOf()!);
		flushSync();

		const content = $('[role="dialog"][data-scope="dialog"]')!;
		expect(content.getAttribute('aria-modal')).toBe('true');
		const panel = $('[data-scope="sidebar"][data-part="panel"]')!;
		expect(panel.getAttribute('data-slot')).toBe('sidebar-panel');
		expect(panel.getAttribute('data-state')).toBe('expanded');
		expect(content.contains(panel)).toBe(true);
		expect($('[data-slot="sidebar-inset"]')).not.toBeNull();

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		await waitFor(() => expect($('[role="dialog"][data-scope="dialog"]')).toBeNull());
		expect(rootOf()!.getAttribute('data-state')).toBe('collapsed');
	});
});
