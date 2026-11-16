import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import Phase5JsonTreeView from './harness/Phase5JsonTreeView.svelte';
import Phase5JsonTreeViewProvider from './harness/Phase5JsonTreeViewProvider.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector<T>(selector);
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const root = () => $('[data-scope="json-tree-view"][data-part="root"]')!;
const tree = () => $('[data-part="tree"]')!;
const rows = () => $$('[role="treeitem"]');
const visibleRows = () => rows().filter((row) => !row.closest('[hidden]'));

const control = (label: string) =>
	$$('[data-part="branch-control"]').find((row) =>
		row.getAttribute('aria-label')?.startsWith(`${label}:`)
	);
const item = (label: string) =>
	$$('[data-part="item"]').find((row) => row.getAttribute('aria-label')?.startsWith(`${label}:`));
const rootControl = () => $$('[data-part="branch-control"]')[0];
const previewOf = (row: HTMLElement | undefined) =>
	row?.querySelector<HTMLElement>('[data-kind="preview"]') ?? null;
const activeLabel = () => document.activeElement?.getAttribute('aria-label');

describe('JsonTreeView', () => {
	test('renders the Ark contract for the root, tree and generated nodes', () => {
		render(Phase5JsonTreeView, { props: { defaultExpandedDepth: 2 } });

		expect(root().getAttribute('data-slot')).toBe('json-tree-view-root');
		expect(tree().getAttribute('data-slot')).toBe('json-tree-view-tree');
		expect(tree().getAttribute('role')).toBe('tree');
		expect(tree().getAttribute('aria-label')).toBe('Tree View');
		expect(tree().getAttribute('aria-labelledby')).toBe(`tree:${tree().id.split(':')[1]}:label`);
		expect(tree().getAttribute('data-ownedby')).toBeNull();

		const top = rootControl();
		expect(top).toBeDefined();
		expect(top!.getAttribute('role')).toBe('button');
		expect(top!.parentElement!.getAttribute('role')).toBe('treeitem');
		expect(top!.parentElement!.getAttribute('data-part')).toBe('branch');
		expect(top!.parentElement!.getAttribute('aria-expanded')).toBe('true');
		expect(top!.parentElement!.getAttribute('data-state')).toBe('open');
		expect(top!.getAttribute('data-state')).toBe('open');
		expect(top!.getAttribute('data-depth')).toBe('1');
		expect(top!.getAttribute('data-value')).toBeTruthy();
		expect(top!.getAttribute('data-line')).toBe('1');
		expect(top!.getAttribute('aria-label')).toBe('Object, expandable with 4 properties');
		expect(top!.parentElement!.style.getPropertyValue('--depth')).toBe('1');
		expect(top!.style.getPropertyValue('--line-length')).toBe('0');

		const environment = item('environment');
		expect(environment).toBeDefined();
		expect(environment!.getAttribute('role')).toBe('treeitem');
		expect(environment!.getAttribute('data-depth')).toBe('2');
		expect(environment!.getAttribute('data-line')).toBe('1');
		expect(environment!.style.getPropertyValue('--line-length')).toBe('1');
		expect(environment!.getAttribute('aria-label')).toBe('environment: "production"');

		expect(environment!.querySelector('[data-kind="key"]')!.textContent?.trim()).toBe(
			'environment'
		);
		expect(environment!.querySelector('[data-kind="colon"]')).not.toBeNull();
		expect(environment!.querySelector('[data-part="item-text"]')).not.toBeNull();

		const value = previewOf(environment);
		expect(value!.getAttribute('data-type')).toBe('string');
		expect(value!.getAttribute('data-kind')).toBe('preview');
		expect(value!.textContent).toBe('"production"');

		const topValue = previewOf(top);
		expect(topValue!.getAttribute('data-type')).toBe('object');
		expect(topValue!.hasAttribute('data-root')).toBe(true);
		expect(topValue!.querySelector('[data-kind="brace"]')).not.toBeNull();
		expect(topValue!.querySelector('[data-kind="preview-text"]')).not.toBeNull();
	});

	test('expands nested objects and arrays and reports the expanded values', async () => {
		const onExpandedChange = vi.fn();
		render(Phase5JsonTreeView, { props: { defaultExpandedDepth: 1, onExpandedChange } });

		expect(visibleRows().map((row) => row.getAttribute('data-part'))).toEqual([
			'branch',
			'item',
			'branch',
			'branch',
			'branch'
		]);
		expect(item('branch')!.closest('[hidden]')).not.toBeNull();

		await fireEvent.click(control('release')!);

		expect(control('release')!.parentElement!.getAttribute('aria-expanded')).toBe('true');
		expect(onExpandedChange.mock.calls.at(-1)?.[0].expandedValue).toHaveLength(2);

		const branchLeaf = item('branch')!;
		expect(branchLeaf.closest('[hidden]')).toBeNull();
		expect(branchLeaf.getAttribute('aria-label')).toBe('branch: "main"');
		expect(previewOf(branchLeaf)!.getAttribute('data-type')).toBe('string');

		await fireEvent.click(control('rollout')!);
		expect(previewOf(item('canary'))!.getAttribute('data-type')).toBe('boolean');
		expect(previewOf(item('percentage'))!.getAttribute('data-type')).toBe('number');

		await fireEvent.click(control('services')!);
		expect(previewOf(control('services'))!.textContent).toContain('[');
		expect(previewOf(control('services'))!.getAttribute('data-type')).toBe('array');
		expect(item('0')).not.toBeNull();
		expect(previewOf(item('2'))!.textContent).toBe('"website"');
	});

	test('keyboard navigation moves between generated nodes and expands on ArrowRight', async () => {
		render(Phase5JsonTreeView, { props: { defaultExpandedDepth: 1 } });

		const top = rootControl();
		top.focus();
		await fireEvent.focus(top);
		expect(activeLabel()).toBe('Object, expandable with 4 properties');

		await fireEvent.keyDown(top, { key: 'ArrowDown' });
		expect(activeLabel()).toBe('environment: "production"');

		await fireEvent.keyDown(item('environment')!, { key: 'ArrowDown' });
		expect(activeLabel()).toContain('release:');

		await fireEvent.keyDown(control('release')!, { key: 'ArrowRight' });
		expect(control('release')!.parentElement!.getAttribute('aria-expanded')).toBe('true');

		await fireEvent.keyDown(control('release')!, { key: 'ArrowRight' });
		expect(activeLabel()).toBe('branch: "main"');

		await fireEvent.keyDown(item('branch')!, { key: 'ArrowLeft' });
		expect(activeLabel()).toContain('release:');

		await fireEvent.keyDown(control('release')!, { key: 'ArrowLeft' });
		expect(control('release')!.parentElement!.getAttribute('aria-expanded')).toBe('false');

		await fireEvent.keyDown(control('release')!, { key: 'End' });
		expect(activeLabel()).toContain('rollout:');

		await fireEvent.keyDown(control('rollout')!, { key: 'Home' });
		expect(activeLabel()).toBe('Object, expandable with 4 properties');
	});

	test('preview options shape the rendered values', async () => {
		render(Phase5JsonTreeView, {
			props: {
				defaultExpandedDepth: 1,
				maxPreviewItems: 1,
				quotesOnKeys: true,
				collapseStringsAfterLength: 4
			}
		});

		const rootPreview = previewOf(rootControl());
		expect(rootPreview!.textContent).toContain('environment: "prod…"');
		expect(rootPreview!.textContent).toContain(', … ');

		expect(item('environment')!.querySelector('[data-kind="key"]')!.textContent?.trim()).toBe(
			'"environment"'
		);

		await fireEvent.click(control('rollout')!);
		expect(previewOf(item('canary'))!.textContent).toBe('true');
		expect(previewOf(item('percentage'))!.getAttribute('data-type')).toBe('number');
	});

	test('a filtered value only renders the surviving entries', () => {
		render(Phase5JsonTreeView, { props: { defaultExpandedDepth: 2, query: 'canary' } });

		expect(visibleRows().map((row) => row.getAttribute('data-part'))).toEqual([
			'branch',
			'branch',
			'item'
		]);
		expect(item('environment')).toBeUndefined();
		expect(item('branch')).toBeUndefined();
		expect(item('canary')).not.toBeNull();
		expect(previewOf(item('canary'))!.textContent).toBe('true');
	});

	test('re-seeds expansion to the default depth when the inspected value is replaced', async () => {
		const view = render(Phase5JsonTreeView, { props: { defaultExpandedDepth: 2 } });
		expect(item('environment')).not.toBeNull();
		expect(item('branch')).not.toBeNull();

		await view.rerender({ defaultExpandedDepth: 1, query: 'canary' });

		await waitFor(() => expect(item('environment')).toBeUndefined());
		expect(item('canary')).not.toBeNull();
		expect(visibleRows()).toHaveLength(2);
	});

	test('renders custom values and indent guides', () => {
		render(Phase5JsonTreeView, {
			props: { defaultExpandedDepth: 2, indentGuide: true, customValue: true }
		});

		expect($('[data-part="branch-indent-guide"]')).not.toBeNull();
		expect($('[data-custom-value]')).not.toBeNull();
		expect($('[data-custom-value]')!.textContent).toBe('"production"');
	});
});

describe('JsonTreeViewRootProvider', () => {
	test('drives the generated tree from an api created outside the parts', async () => {
		render(Phase5JsonTreeViewProvider, { props: {} });

		expect($('[data-part="root"]')!.getAttribute('data-slot')).toBe(
			'json-tree-view-root-provider'
		);
		expect(item('one')).not.toBeNull();
		expect(control('beta')!.parentElement!.getAttribute('aria-expanded')).toBe('false');

		await fireEvent.click($('[data-testid="expand-all"]')!);

		await waitFor(() =>
			expect(previewOf(item('1'))!.textContent).toBe('null')
		);
		expect(control('beta')!.parentElement!.getAttribute('aria-expanded')).toBe('true');
	});
});
