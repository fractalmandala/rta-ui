import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase5TreeView from './harness/Phase5TreeView.svelte';
import Phase5TreeViewProvider from './harness/Phase5TreeViewProvider.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector<T>(selector);
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const root = () => $('[data-scope="tree-view"][data-part="root"]')!;
const tree = () => $('[data-part="tree"]')!;
const rows = () => $$('[role="treeitem"]');
const leaf = (value: string) => $(`[data-part="item"][data-value="${value}"]`);
const branch = (value: string) => $<HTMLElement>(`[data-part="branch"][data-value="${value}"]`);
const control = (value: string) => $(`[data-part="branch-control"][data-value="${value}"]`);
const content = (value: string) => branch(value)?.querySelector<HTMLElement>('[data-part="branch-content"]');

const focusRow = async (node: HTMLElement) => {
	node.focus();
	await fireEvent.focus(node);
};

const visibleRows = () => rows().filter((row) => !row.closest('[hidden]'));
const activeValue = () => (document.activeElement as HTMLElement | null)?.dataset?.value;

describe('TreeView', () => {
	test('renders the Ark contract: ids, roles and data hooks', () => {
		render(Phase5TreeView, { props: { defaultExpandedValue: ['src'] } });

		const scope = root();
		expect(scope.getAttribute('data-slot')).toBe('tree-view-root');
		expect(scope.id).toBe(`tree:${scope.id.split(':')[1]}:root`);

		const label = $('[data-part="label"]')!;
		expect(label.getAttribute('data-slot')).toBe('tree-view-label');
		expect(label.tagName).toBe('H3');
		expect(label.id).toBe(`tree:${scope.id.split(':')[1]}:label`);

		expect(tree().getAttribute('data-slot')).toBe('tree-view-tree');
		expect(tree().getAttribute('role')).toBe('tree');
		expect(tree().getAttribute('aria-label')).toBe('Tree View');
		expect(tree().getAttribute('aria-labelledby')).toBe(label.id);
		expect(tree().getAttribute('tabindex')).toBe('-1');
		expect(tree().hasAttribute('aria-multiselectable')).toBe(false);

		const source = branch('src')!;
		expect(source.getAttribute('data-slot')).toBe('tree-view-branch');
		expect(source.getAttribute('role')).toBe('treeitem');
		expect(source.getAttribute('aria-level')).toBe('1');
		expect(source.getAttribute('aria-expanded')).toBe('true');
		expect(source.getAttribute('data-state')).toBe('open');
		expect(source.getAttribute('data-depth')).toBe('1');
		expect(source.style.getPropertyValue('--depth')).toBe('1');
		expect(source.getAttribute('data-ownedby')).toBe(tree().id);
		expect(source.getAttribute('data-path')).toBe('0');

		const sourceControl = control('src')!;
		expect(sourceControl.getAttribute('data-slot')).toBe('tree-view-branch-control');
		expect(sourceControl.getAttribute('role')).toBe('button');
		expect(sourceControl.id).toBe(`tree:${scope.id.split(':')[1]}:node:src`);
		expect(sourceControl.getAttribute('tabindex')).toBe('0');
		expect(sourceControl.hasAttribute('data-focus')).toBe(true);

		const sourceContent = content('src')!;
		expect(sourceContent.getAttribute('data-slot')).toBe('tree-view-branch-content');
		expect(sourceContent.getAttribute('role')).toBe('group');
		expect(sourceContent.getAttribute('data-state')).toBe('open');
		expect(sourceContent.hidden).toBe(false);

		const app = leaf('src/App.tsx')!;
		expect(app.getAttribute('data-slot')).toBe('tree-view-item');
		expect(app.getAttribute('role')).toBe('treeitem');
		expect(app.getAttribute('aria-level')).toBe('2');
		expect(app.getAttribute('data-depth')).toBe('2');
		expect(app.getAttribute('tabindex')).toBe('-1');
		expect(app.getAttribute('data-path')).toBe('0/0');
		expect($('[data-part="item-text"]')!.getAttribute('data-slot')).toBe('tree-view-item-text');
		expect($('[data-part="item-indicator"]')!.getAttribute('data-slot')).toBe(
			'tree-view-item-indicator'
		);
		expect($('[data-part="branch-indicator"]')!.getAttribute('data-slot')).toBe(
			'tree-view-branch-indicator'
		);
		expect($('[data-part="branch-indent-guide"]')!.getAttribute('data-slot')).toBe(
			'tree-view-branch-indent-guide'
		);
		expect($('[data-part="branch-text"]')!.getAttribute('data-slot')).toBe(
			'tree-view-branch-text'
		);

		const collapsed = branch('public')!;
		expect(collapsed.getAttribute('aria-expanded')).toBe('false');
		expect(collapsed.getAttribute('data-state')).toBe('closed');
		expect(content('public')!.hidden).toBe(true);
		expect(collapsed.hasAttribute('data-selected')).toBe(false);
	});

	test('expands and collapses a branch from the pointer and reports details', async () => {
		const onExpandedChange = vi.fn();
		render(Phase5TreeView, { props: { onExpandedChange } });

		expect(branch('src')!.getAttribute('aria-expanded')).toBe('false');
		expect(content('src')!.hidden).toBe(true);
		expect(visibleRows().map((row) => row.dataset.value)).toEqual([
			'src',
			'public',
			'package.json',
			'README.md',
			'lazy',
			'locked'
		]);

		await fireEvent.click(control('src')!);

		expect(branch('src')!.getAttribute('aria-expanded')).toBe('true');
		expect(branch('src')!.getAttribute('data-state')).toBe('open');
		expect(control('src')!.getAttribute('data-state')).toBe('open');
		expect(content('src')!.hidden).toBe(false);
		expect(visibleRows().map((row) => row.dataset.value)).toEqual([
			'src',
			'src/App.tsx',
			'src/components',
			'public',
			'package.json',
			'README.md',
			'lazy',
			'locked'
		]);
		expect(onExpandedChange).toHaveBeenCalledTimes(1);
		expect(onExpandedChange.mock.calls[0][0].expandedValue).toEqual(['src']);
		expect(onExpandedChange.mock.calls[0][0].expandedNodes).toHaveLength(1);

		await fireEvent.click(control('src')!);
		expect(branch('src')!.getAttribute('aria-expanded')).toBe('false');
		expect(content('src')!.hidden).toBe(true);
		expect(onExpandedChange.mock.calls[1][0].expandedValue).toEqual([]);
	});

	test('keyboard navigation follows the ARIA tree pattern', async () => {
		render(Phase5TreeView, { props: { defaultExpandedValue: ['src'] } });

		await focusRow(control('src')!);
		expect(activeValue()).toBe('src');
		expect(control('src')!.hasAttribute('data-focus')).toBe(true);

		await fireEvent.keyDown(control('src')!, { key: 'ArrowDown' });
		expect(activeValue()).toBe('src/App.tsx');
		expect(leaf('src/App.tsx')!.getAttribute('tabindex')).toBe('0');
		expect(control('src')!.getAttribute('tabindex')).toBe('-1');

		await fireEvent.keyDown(leaf('src/App.tsx')!, { key: 'ArrowDown' });
		expect(activeValue()).toBe('src/components');

		await fireEvent.keyDown(control('src/components')!, { key: 'ArrowRight' });
		expect(branch('src/components')!.getAttribute('aria-expanded')).toBe('true');
		expect(activeValue()).toBe('src/components');

		await fireEvent.keyDown(control('src/components')!, { key: 'ArrowRight' });
		expect(activeValue()).toBe('src/components/Button.tsx');

		await fireEvent.keyDown(leaf('src/components/Button.tsx')!, { key: 'ArrowLeft' });
		expect(activeValue()).toBe('src/components');

		await fireEvent.keyDown(control('src/components')!, { key: 'ArrowLeft' });
		expect(branch('src/components')!.getAttribute('aria-expanded')).toBe('false');
		expect(activeValue()).toBe('src/components');

		await fireEvent.keyDown(control('src/components')!, { key: 'Home' });
		expect(activeValue()).toBe('src');

		await fireEvent.keyDown(control('src')!, { key: 'End' });
		expect(activeValue()).toBe('lazy');

		await fireEvent.keyDown(control('src')!, { key: 'ArrowLeft' });
		expect(branch('src')!.getAttribute('aria-expanded')).toBe('false');
	});

	test('typeahead focuses the next visible node that matches', async () => {
		render(Phase5TreeView, { props: { defaultExpandedValue: ['src'] } });

		await focusRow(control('src')!);
		await fireEvent.keyDown(control('src')!, { key: 'p' });
		expect(activeValue()).toBe('public');

		await fireEvent.keyDown(control('public')!, { key: 'r' });
		expect(activeValue()).toBe('README.md');

		await fireEvent.keyDown(leaf('README.md')!, { key: '*' });
		expect(branch('src')!.getAttribute('aria-expanded')).toBe('true');
	});

	test('selects in single and multiple mode, including modifier clicks', async () => {
		const onSelectionChange = vi.fn();
		render(Phase5TreeView, { props: { selectionMode: 'multiple', onSelectionChange } });

		expect(tree().getAttribute('aria-multiselectable')).toBe('true');

		await fireEvent.click(leaf('package.json')!);
		expect(leaf('package.json')!.getAttribute('aria-selected')).toBe('true');
		expect(leaf('package.json')!.hasAttribute('data-selected')).toBe(true);

		await fireEvent.click(leaf('README.md')!, { ctrlKey: true });
		expect(onSelectionChange.mock.lastCall?.[0].selectedValue).toEqual([
			'package.json',
			'README.md'
		]);

		await fireEvent.click(leaf('README.md')!, { ctrlKey: true });
		expect(onSelectionChange.mock.lastCall?.[0].selectedValue).toEqual(['package.json']);

		await fireEvent.click(leaf('README.md')!);
		expect(onSelectionChange.mock.lastCall?.[0].selectedValue).toEqual(['README.md']);

		await focusRow(control('public')!);
		await fireEvent.keyDown(control('public')!, { key: 'a', metaKey: true });
		expect(onSelectionChange.mock.lastCall?.[0].selectedValue).toHaveLength(11);
	});

	test('checkbox tree reports checked and indeterminate state', async () => {
		const onCheckedChange = vi.fn();
		render(Phase5TreeView, {
			props: { checkboxes: true, defaultExpandedValue: ['src'], onCheckedChange }
		});

		const sourceCheckbox = control('src')!.querySelector<HTMLElement>(
			'[data-part="node-checkbox"]'
		)!;
		expect(sourceCheckbox.getAttribute('data-slot')).toBe('tree-view-node-checkbox');
		expect(sourceCheckbox.getAttribute('role')).toBe('checkbox');
		expect(sourceCheckbox.getAttribute('data-state')).toBe('unchecked');
		expect(sourceCheckbox.getAttribute('aria-checked')).toBe('false');
		expect($('[data-part="node-checkbox-indicator"]')!.getAttribute('data-slot')).toBe(
			'tree-view-node-checkbox-indicator'
		);

		const appCheckbox = leaf('src/App.tsx')!.querySelector<HTMLElement>(
			'[data-part="node-checkbox"]'
		)!;
		await fireEvent.click(appCheckbox);
		expect(appCheckbox.getAttribute('data-state')).toBe('checked');
		expect(sourceCheckbox.getAttribute('data-state')).toBe('indeterminate');
		expect(sourceCheckbox.getAttribute('aria-checked')).toBe('mixed');
		expect(control('src')!.hasAttribute('data-indeterminate')).toBe(true);
		expect(branch('src')!.getAttribute('aria-selected')).toBe('false');

		await fireEvent.click(sourceCheckbox);
		expect(onCheckedChange.mock.lastCall?.[0].checkedValue).toEqual([
			'src/App.tsx',
			'src/components/Button.tsx',
			'src/components/Dialog.tsx'
		]);
		expect(sourceCheckbox.getAttribute('data-state')).toBe('checked');
		expect(appCheckbox.getAttribute('data-state')).toBe('checked');

		await fireEvent.click(sourceCheckbox);
		expect(onCheckedChange.mock.lastCall?.[0].checkedValue).toEqual([]);
		expect(sourceCheckbox.getAttribute('data-state')).toBe('unchecked');
	});

	test('loads children asynchronously through loadChildren', async () => {
		const requested: { valuePath: string[] }[] = [];
		let resolveChildren: (nodes: { id: string; name: string }[]) => void = () => {};
		const loadChildren = vi.fn(
			(details: { valuePath: string[] }) =>
				new Promise<{ id: string; name: string }[]>((resolve) => {
					requested.push(details);
					resolveChildren = resolve;
				})
		);
		const onLoadChildrenComplete = vi.fn();
		render(Phase5TreeView, { props: { loadChildren, onLoadChildrenComplete } });

		await focusRow(control('lazy')!);
		await fireEvent.keyDown(control('lazy')!, { key: 'ArrowRight' });

		expect(control('lazy')!.hasAttribute('data-loading')).toBe(true);
		expect(branch('lazy')!.getAttribute('aria-busy')).toBe('true');
		expect(requested).toHaveLength(1);
		expect(requested[0].valuePath).toEqual(['lazy']);

		resolveChildren([{ id: 'lazy/child', name: 'child.ts' }]);
		await waitFor(() => expect(leaf('lazy/child')).not.toBeNull());
		expect(branch('lazy')!.getAttribute('aria-expanded')).toBe('true');
		expect(control('lazy')!.hasAttribute('data-loading')).toBe(false);
		expect(onLoadChildrenComplete).toHaveBeenCalledTimes(1);
	});

	test('renames a node from the rename input', async () => {
		const onRenameComplete = vi.fn();
		render(Phase5TreeView, {
			props: {
				rename: true,
				canRename: () => true,
				defaultExpandedValue: ['src'],
				onRenameComplete
			}
		});

		const appRow = leaf('src/App.tsx')!;
		const input = appRow.querySelector<HTMLInputElement>('[data-part="node-rename-input"]')!;
		expect(input.getAttribute('data-slot')).toBe('tree-view-node-rename-input');
		expect(input.hidden).toBe(true);
		expect(input.getAttribute('aria-label')).toBe('Rename tree item');

		await focusRow(appRow);
		await fireEvent.keyDown(appRow, { key: 'F2' });

		await waitFor(() => expect(input.hidden).toBe(false));
		await waitFor(() => expect(input.value).toBe('App.tsx'));
		await waitFor(() => expect(document.activeElement).toBe(input));

		await fireEvent.input(input, { target: { value: 'Main.tsx' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onRenameComplete).toHaveBeenCalledTimes(1);
		expect(onRenameComplete.mock.calls[0][0]).toMatchObject({ value: 'src/App.tsx', label: 'Main.tsx' });
		await waitFor(() => expect(leaf('src/App.tsx')!.textContent).toContain('Main.tsx'));
	});
});

describe('TreeViewRootProvider', () => {
	test('drives the tree from an api created outside the parts', async () => {
		render(Phase5TreeViewProvider, { props: {} });

		expect($('[data-part="root"]')!.getAttribute('data-slot')).toBe(
			'tree-view-root-provider'
		);
		expect(branch('alpha')!.getAttribute('aria-expanded')).toBe('true');
		expect(branch('beta')!.getAttribute('aria-expanded')).toBe('false');
		expect(leaf('alpha/one')).not.toBeNull();
		expect(leaf('beta/one')!.closest('[hidden]')).not.toBeNull();

		await fireEvent.click($('[data-testid="expand-beta"]')!);

		expect(branch('beta')!.getAttribute('aria-expanded')).toBe('true');
		expect(leaf('beta/one')!.closest('[hidden]')).toBeNull();
		expect(leaf('alpha/one')!.getAttribute('aria-selected')).toBe('true');
	});
});
