import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import {
	getCheckedState,
	getCheckedValueMap,
	toggleBranchChecked,
	type CheckedState,
	type CheckedValueMap
} from './checked-state';
import type { IndexPath, TreeCollection, TreeNode, ValuePath } from './collection';
import { diff, partition, removeAll, sameArray, uniq } from './utils';

export type TreeViewSelectionMode = 'single' | 'multiple';
export type TreeLoadingStatus = 'loading' | 'loaded';
export type TreeLoadingStatusMap = Record<string, TreeLoadingStatus>;

export interface TreeViewElementIds {
	root?: string;
	tree?: string;
	label?: string;
	node?: (value: string) => string;
}

export interface TreeViewTranslations {
	treeLabel?: string;
	renameInputLabel?: string;
}

export interface TreeViewFocusChangeDetails<T extends TreeNode = TreeNode> {
	focusedValue: string | null;
	readonly focusedNode: T | null;
}

export interface TreeViewExpandedChangeDetails<T extends TreeNode = TreeNode> {
	focusedValue: string | null;
	expandedValue: string[];
	readonly expandedNodes: T[];
}

export interface TreeViewSelectionChangeDetails<T extends TreeNode = TreeNode> {
	focusedValue: string | null;
	selectedValue: string[];
	readonly selectedNodes: T[];
}

export interface TreeViewCheckedChangeDetails {
	checkedValue: string[];
}

export interface TreeViewRenameStartDetails<T extends TreeNode = TreeNode> {
	value: string;
	node: T;
	indexPath: IndexPath;
}

export interface TreeViewRenameCompleteDetails {
	value: string;
	label: string;
	indexPath: IndexPath;
}

export interface TreeViewLoadChildrenDetails<T extends TreeNode = TreeNode> {
	valuePath: ValuePath;
	indexPath: IndexPath;
	node: T;
	signal: AbortSignal;
}

export interface TreeViewLoadChildrenCompleteDetails<T extends TreeNode = TreeNode> {
	collection: TreeCollection<T>;
}

export interface TreeViewNodeWithError<T extends TreeNode = TreeNode> {
	node: T;
	error: Error;
	indexPath: IndexPath;
	valuePath: ValuePath;
}

export interface TreeViewLoadChildrenErrorDetails<T extends TreeNode = TreeNode> {
	nodes: TreeViewNodeWithError<T>[];
}

export interface TreeViewScrollToIndexDetails<T extends TreeNode = TreeNode> {
	index: number;
	node: T;
	indexPath: IndexPath;
	getElement: () => HTMLElement | null;
}

export interface TreeViewNodeProps<T extends TreeNode = TreeNode> {
	node: T;
	indexPath: IndexPath;
}

export interface TreeViewNodeState {
	id: string;
	value: string;
	indexPath: IndexPath;
	valuePath: ValuePath;
	disabled: boolean;
	focused: boolean;
	selected: boolean;
	expanded: boolean;
	loading: boolean;
	depth: number;
	isBranch: boolean;
	renaming: boolean;
	readonly checked: CheckedState;
}

export interface UseTreeViewProps<T extends TreeNode = TreeNode> {
	collection: TreeCollection<T>;
	id?: string | null;
	ids?: TreeViewElementIds;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	translations?: TreeViewTranslations;
	expandedValue?: string[];
	defaultExpandedValue?: string[];
	selectedValue?: string[];
	defaultSelectedValue?: string[];
	checkedValue?: string[];
	defaultCheckedValue?: string[];
	focusedValue?: string | null;
	defaultFocusedValue?: string | null;
	selectionMode?: TreeViewSelectionMode;
	typeahead?: boolean;
	expandOnClick?: boolean;
	loadChildren?: (details: TreeViewLoadChildrenDetails<T>) => Promise<T[]>;
	canRename?: (node: T, indexPath: IndexPath) => boolean;
	scrollToIndexFn?: (details: TreeViewScrollToIndexDetails<T>) => void;
	onExpandedChange?: (details: TreeViewExpandedChangeDetails<T>) => void;
	onSelectionChange?: (details: TreeViewSelectionChangeDetails<T>) => void;
	onFocusChange?: (details: TreeViewFocusChangeDetails<T>) => void;
	onCheckedChange?: (details: TreeViewCheckedChangeDetails) => void;
	onRenameStart?: (details: TreeViewRenameStartDetails<T>) => void;
	onBeforeRename?: (details: TreeViewRenameCompleteDetails) => boolean;
	onRenameComplete?: (details: TreeViewRenameCompleteDetails) => void;
	onLoadChildrenComplete?: (details: TreeViewLoadChildrenCompleteDetails<T>) => void;
	onLoadChildrenError?: (details: TreeViewLoadChildrenErrorDetails<T>) => void;
}

export interface TreeViewApi<T extends TreeNode = TreeNode> {
	readonly collection: TreeCollection<T>;
	readonly expandedValue: string[];
	readonly selectedValue: string[];
	readonly checkedValue: string[];
	readonly focusedValue: string | null;
	readonly renamingValue: string | null;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	getVisibleNodes(): TreeViewNodeProps<T>[];
	getNodeState(props: TreeViewNodeProps<T>): TreeViewNodeState;
	getCheckedMap(): CheckedValueMap;
	setExpandedValue(value: string[]): void;
	setSelectedValue(value: string[]): void;
	expand(value?: string[]): void;
	collapse(value?: string[]): void;
	select(value?: string[]): void;
	deselect(value?: string[]): void;
	focus(value: string): void;
	selectParent(value: string): void;
	expandParent(value: string): void;
	toggleChecked(value: string, isBranch: boolean): void;
	setChecked(value: string[]): void;
	clearChecked(): void;
	startRenaming(value: string): void;
	submitRenaming(value: string, label: string): void;
	cancelRenaming(): void;
	registerTree(node: HTMLElement | null): void;
	getRootProps(): Record<string, unknown>;
	getLabelProps(): Record<string, unknown>;
	getTreeProps(): Record<string, unknown>;
	getItemProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getItemTextProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getItemIndicatorProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchIndicatorProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchTriggerProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchControlProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchTextProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchContentProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getBranchIndentGuideProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getNodeCheckboxProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
	getNodeRenameInputProps(props: TreeViewNodeProps<T>): Record<string, unknown>;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function isEditableElement(target: EventTarget | null): boolean {
	const element = target as HTMLElement | null;
	if (!element || typeof element.tagName !== 'string') return false;
	try {
		return (
			((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') &&
				(element as HTMLInputElement).selectionStart != null) ||
			element.isContentEditable ||
			element.getAttribute('contenteditable') === 'true' ||
			element.getAttribute('contenteditable') === ''
		);
	} catch {
		return false;
	}
}

function isAnchorElement(target: EventTarget | null): boolean {
	return (target as HTMLElement | null)?.matches?.('a[href]') ?? false;
}

// `internal/collection.ts#createTypeahead` calls `$state` from a plain `.ts` module, which throws
// `rune_outside_svelte` at runtime, so the search buffer lives here. Matching follows Zag's
// getByText: search forward from the focused node, wrap, and cycle when one character repeats.
function createTreeTypeahead(getItems: () => { value: string; label: string }[]) {
	let search = '';
	let timer: ReturnType<typeof setTimeout> | undefined;

	function clear() {
		search = '';
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
	}

	function match(query: string, current?: string): string | undefined {
		const items = getItems();
		if (!items.length) return undefined;
		const currentIndex = current == null ? -1 : items.findIndex((item) => item.value === current);
		const ordered =
			currentIndex < 0
				? items
				: [...items.slice(currentIndex), ...items.slice(0, currentIndex)];
		const text = query.toLowerCase();
		const candidates = text.length === 1 ? ordered.filter((item) => item.value !== current) : ordered;
		return candidates.find((item) => item.label.toLowerCase().startsWith(text))?.value;
	}

	return {
		get typing() {
			return search.length > 0;
		},
		onKey(key: string, current?: string): string | undefined {
			if (key.length !== 1 || key === ' ') return undefined;
			const next = search + key;
			search = next.length > 1 && new Set(next).size === 1 ? key : next;
			if (timer !== undefined) clearTimeout(timer);
			timer = setTimeout(clear, 350);
			const result = match(search, current);
			if (result !== undefined) return result;
			search = key;
			return match(key, current);
		},
		clear
	};
}

function raf(callback: () => void): void {
	if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => callback());
	else setTimeout(callback, 0);
}

const NORMALIZED_KEYS: Record<string, string> = {
	Up: 'ArrowUp',
	Down: 'ArrowDown',
	Left: 'ArrowLeft',
	Right: 'ArrowRight',
	Esc: 'Escape',
	' ': 'Space'
};

export type TreeViewContextApi = TreeViewApi<TreeNode>;

const treeViewContext = createContext<TreeViewContextApi>('TreeView', 'TreeView.Root');
export const setTreeViewContext = (api: TreeViewContextApi) => treeViewContext.set(api);
export const useTreeViewContext = () => treeViewContext.get();

const nodeStateContext = createContext<() => TreeViewNodeState>('TreeViewNode', 'TreeView.NodeProvider');
export const useTreeViewNodeContext = () => nodeStateContext.get();
export const setTreeViewNodeContext = (state: () => TreeViewNodeState) => nodeStateContext.set(state);

const nodePropsContext = createContext<() => TreeViewNodeProps>('TreeViewNodeProps', 'TreeView.NodeProvider');
export const useTreeViewNodePropsContext = () => nodePropsContext.get();
export const setTreeViewNodePropsContext = (props: () => TreeViewNodeProps) =>
	nodePropsContext.set(props);

export function createTreeView<T extends TreeNode = TreeNode>(
	getProps: () => UseTreeViewProps<T>,
	uid: string
): TreeViewApi<T> {
	const id = getProps().id ?? uid;

	const rootId = () => getProps().ids?.root ?? `tree:${id}:root`;
	const labelId = () => getProps().ids?.label ?? `tree:${id}:label`;
	const treeId = () => getProps().ids?.tree ?? `tree:${id}:tree`;
	const nodeId = (value: string) => getProps().ids?.node?.(value) ?? `tree:${id}:node:${value}`;
	const renameInputId = (value: string) => `tree:${id}:rename-input:${value}`;

	const collection = () => getProps().collection;
	const dir = () => getProps().dir;
	const treeLabel = () => getProps().translations?.treeLabel ?? 'Tree View';
	const renameInputLabel = () => getProps().translations?.renameInputLabel ?? 'Rename tree item';

	let internalExpanded = $state<string[]>(getProps().defaultExpandedValue ?? []);
	let internalSelected = $state<string[]>(getProps().defaultSelectedValue ?? []);
	let internalChecked = $state<string[]>(getProps().defaultCheckedValue ?? []);
	let internalFocused = $state<string | null>(getProps().defaultFocusedValue ?? null);
	let loadingStatus = $state<TreeLoadingStatusMap>({});
	let renamingValue = $state<string | null>(null);
	let treeNode = $state<HTMLElement | null>(null);

	const pendingAborts = new Map<string, AbortController>();

	const expandedValue = () => getProps().expandedValue ?? internalExpanded;
	const selectedValue = () => getProps().selectedValue ?? internalSelected;
	const checkedValue = () => getProps().checkedValue ?? internalChecked;
	const focusedValue = () =>
		getProps().focusedValue === undefined ? internalFocused : getProps().focusedValue;

	const isMultiple = () => getProps().selectionMode === 'multiple';

	const skip = (args: { indexPath: IndexPath }) =>
		collection()
			.getValuePath(args.indexPath)
			.slice(0, -1)
			.some((value) => !expandedValue().includes(value));

	function getVisibleNodes(): TreeViewNodeProps<T>[] {
		const nodes: TreeViewNodeProps<T>[] = [];
		collection().visit({
			skip,
			onEnter: (node, indexPath) => {
				nodes.push({ node, indexPath });
			}
		});
		return nodes;
	}

	function byId(elementId: string): HTMLElement | null {
		const node = treeNode;
		if (!node) {
			return typeof document === 'undefined' ? null : document.getElementById(elementId);
		}
		const root = node.getRootNode();
		if (root instanceof Document) return root.getElementById(elementId);
		if (root instanceof ShadowRoot) {
			return (
				Array.from(root.querySelectorAll<HTMLElement>('[id]')).find(
					(element) => element.id === elementId
				) ?? null
			);
		}
		return null;
	}

	function focusNode(value: string | null): void {
		if (value == null) return;
		byId(nodeId(value))?.focus();
	}

	function scrollToNode(value: string): boolean {
		const scrollToIndexFn = getProps().scrollToIndexFn;
		if (!scrollToIndexFn) return false;
		const nodes = getVisibleNodes();
		for (let index = 0; index < nodes.length; index++) {
			const { node, indexPath } = nodes[index];
			if (collection().getNodeValue(node) !== value) continue;
			scrollToIndexFn({
				index,
				node,
				indexPath,
				getElement: () => byId(nodeId(value))
			});
			return true;
		}
		return false;
	}

	function focusAndScroll(value: string): void {
		if (scrollToNode(value)) raf(() => focusNode(value));
		else focusNode(value);
	}

	function commitExpanded(next: string[]): void {
		if (sameArray(next, expandedValue())) return;
		if (getProps().expandedValue === undefined) internalExpanded = next;
		getProps().onExpandedChange?.({
			expandedValue: next,
			focusedValue: focusedValue() ?? null,
			get expandedNodes() {
				return collection().findNodes(next);
			}
		});
	}

	function commitSelected(next: string[]): void {
		if (sameArray(next, selectedValue())) return;
		if (getProps().selectedValue === undefined) internalSelected = next;
		getProps().onSelectionChange?.({
			selectedValue: next,
			focusedValue: focusedValue() ?? null,
			get selectedNodes() {
				return collection().findNodes(next);
			}
		});
	}

	function commitChecked(next: string[]): void {
		if (sameArray(next, checkedValue())) return;
		if (getProps().checkedValue === undefined) internalChecked = next;
		getProps().onCheckedChange?.({ checkedValue: next });
	}

	function commitFocused(next: string | null): void {
		if (next === focusedValue()) return;
		if (getProps().focusedValue === undefined) internalFocused = next;
		getProps().onFocusChange?.({
			focusedValue: next,
			get focusedNode() {
				return next == null ? null : (collection().findNode(next) ?? null);
			}
		});
	}

	function firstNodeValue(): string | null {
		const first = collection().getFirstNode(undefined, { skip });
		return first === undefined ? null : collection().getNodeValue(first);
	}

	function getNodeState(props: TreeViewNodeProps<T>): TreeViewNodeState {
		const { node, indexPath } = props;
		const value = collection().getNodeValue(node);
		const current = focusedValue();
		return {
			id: nodeId(value),
			value,
			indexPath,
			valuePath: collection().getValuePath(indexPath),
			disabled: collection().getNodeDisabled(node),
			focused: current == null ? firstNodeValue() === value : current === value,
			selected: selectedValue().includes(value),
			expanded: expandedValue().includes(value),
			loading: loadingStatus[value] === 'loading',
			depth: indexPath.length,
			isBranch: collection().isBranchNode(node),
			renaming: renamingValue === value,
			get checked() {
				return getCheckedState(collection(), node, checkedValue());
			}
		};
	}

	function commitExpandBranches(values: string[]): void {
		const unique = diff(uniq(values), expandedValue());
		if (unique.length === 0) return;

		if (!getProps().loadChildren) {
			commitExpanded(uniq([...expandedValue(), ...unique]));
			return;
		}

		const [loaded, pending] = partition(unique, (value) => loadingStatus[value] === 'loaded');
		if (loaded.length > 0) commitExpanded(uniq([...expandedValue(), ...loaded]));
		if (pending.length === 0) return;

		const [withChildren, withoutChildren] = partition(pending, (value) => {
			const node = collection().findNode(value);
			return node !== undefined && collection().getNodeChildren(node).length > 0;
		});
		if (withChildren.length > 0) commitExpanded(uniq([...expandedValue(), ...withChildren]));
		if (withoutChildren.length === 0) return;

		loadingStatus = {
			...loadingStatus,
			...Object.fromEntries(withoutChildren.map((value) => [value, 'loading' as const]))
		};
		void loadChildrenFor(withoutChildren);
	}

	async function loadChildrenFor(values: string[]): Promise<void> {
		const loadChildren = getProps().loadChildren;
		if (!loadChildren) return;

		const source = collection();
		const nodesToLoad = values.map((value) => {
			const indexPath = source.getIndexPath(value) ?? [];
			return {
				value,
				indexPath,
				valuePath: source.getValuePath(indexPath),
				node: source.findNode(value) as T
			};
		});

		const promises = nodesToLoad.map(({ value, indexPath, valuePath, node }) => {
			pendingAborts.get(value)?.abort();
			pendingAborts.delete(value);
			const controller = new AbortController();
			pendingAborts.set(value, controller);
			return loadChildren({ valuePath, indexPath, node, signal: controller.signal });
		});

		const results = await Promise.allSettled(promises);
		const loadedValues: string[] = [];
		const failed: TreeViewNodeWithError<T>[] = [];
		const nextStatus: TreeLoadingStatusMap = { ...loadingStatus };
		let nextCollection: TreeCollection<T> = collection();

		results.forEach((result, index) => {
			const { value, indexPath, valuePath, node } = nodesToLoad[index];
			if (result.status === 'fulfilled') {
				nextStatus[value] = 'loaded';
				loadedValues.push(value);
				nextCollection = nextCollection.replace(indexPath, { ...node, children: result.value } as T);
				return;
			}
			pendingAborts.delete(value);
			delete nextStatus[value];
			failed.push({
				node,
				error: result.reason instanceof Error ? result.reason : new Error(String(result.reason)),
				indexPath,
				valuePath
			});
		});

		loadingStatus = nextStatus;
		if (loadedValues.length > 0) {
			commitExpanded(uniq([...expandedValue(), ...loadedValues]));
			getProps().onLoadChildrenComplete?.({ collection: nextCollection });
		}
		if (failed.length > 0) getProps().onLoadChildrenError?.({ nodes: failed });
	}

	function expandBranch(value: string): void {
		commitExpandBranches([value]);
	}

	function collapseBranch(value: string): void {
		commitExpanded(removeAll(expandedValue(), value));
	}

	function toggleBranchNode(value: string): void {
		if (expandedValue().includes(value)) collapseBranch(value);
		else expandBranch(value);
	}

	function expandSiblingBranches(value: string): void {
		const indexPath = collection().getIndexPath(value);
		if (!indexPath) return;
		const values = collection()
			.getSiblingNodes(indexPath)
			.map((node) => collection().getNodeValue(node));
		commitExpandBranches(diff(values, expandedValue()));
	}

	function selectNode(value: string): void {
		commitSelected([value]);
	}

	function toggleNodeSelection(value: string): void {
		commitSelected(
			selectedValue().includes(value)
				? removeAll(selectedValue(), value)
				: uniq([...selectedValue(), value])
		);
	}

	function extendSelectionToNode(value: string): void {
		const anchor =
			selectedValue()[0] ??
			(() => {
				const first = collection().getFirstNode();
				return first === undefined ? '' : collection().getNodeValue(first);
			})();
		const values: string[] = [anchor, value];
		let hits = 0;
		for (const visible of getVisibleNodes()) {
			const visibleValue = collection().getNodeValue(visible.node);
			if (hits === 1) values.push(visibleValue);
			if (visibleValue === anchor || visibleValue === value) hits++;
		}
		commitSelected(uniq(values));
	}

	function extendSelectionToNextNode(value: string): void {
		const next = collection().getNextNode(value, { skip });
		if (next === undefined) return;
		const nextValue = collection().getNodeValue(next);
		const values = new Set(selectedValue());
		if (values.has(value) && values.has(nextValue)) values.delete(value);
		else if (!values.has(nextValue)) values.add(nextValue);
		commitSelected(Array.from(values));
	}

	function extendSelectionToPrevNode(value: string): void {
		const previous = collection().getPreviousNode(value, { skip });
		if (previous === undefined) return;
		const previousValue = collection().getNodeValue(previous);
		const values = new Set(selectedValue());
		if (values.has(value) && values.has(previousValue)) values.delete(value);
		else if (!values.has(previousValue)) values.add(previousValue);
		commitSelected(Array.from(values));
	}

	function extendSelectionToFirstNode(): void {
		const currentSelection = selectedValue()[0];
		const values: string[] = [];
		collection().visit({
			skip,
			onEnter: (node) => {
				const value = collection().getNodeValue(node);
				values.push(value);
				if (value === currentSelection) return 'stop';
			}
		});
		commitSelected(values);
	}

	function extendSelectionToLastNode(): void {
		const currentSelection = selectedValue()[0];
		const values: string[] = [];
		let collecting = false;
		collection().visit({
			skip,
			onEnter: (node) => {
				const value = collection().getNodeValue(node);
				if (value === currentSelection) collecting = true;
				if (collecting) values.push(value);
			}
		});
		commitSelected(values);
	}

	function focusTreeFirstNode(): void {
		const first = collection().getFirstNode(undefined, { skip });
		if (first === undefined) return;
		focusAndScroll(collection().getNodeValue(first));
	}

	function focusTreeLastNode(): void {
		const last = collection().getLastNode(undefined, { skip });
		if (last === undefined) return;
		focusAndScroll(collection().getNodeValue(last));
	}

	function focusTreeNextNode(value: string): void {
		const next = collection().getNextNode(value, { skip });
		if (next === undefined) return;
		focusAndScroll(collection().getNodeValue(next));
	}

	function focusTreePrevNode(value: string): void {
		const previous = collection().getPreviousNode(value, { skip });
		if (previous === undefined) return;
		focusAndScroll(collection().getNodeValue(previous));
	}

	function focusBranchNode(value: string): void {
		const parent = collection().getParentNode(value);
		if (parent === undefined) return;
		const parentValue = collection().getNodeValue(parent);
		if (!parentValue) return;
		focusAndScroll(parentValue);
	}

	function focusBranchFirstNode(value: string): void {
		const branch = collection().findNode(value);
		if (branch === undefined) return;
		const first = collection().getFirstNode(branch, { skip });
		if (first === undefined) return;
		focusAndScroll(collection().getNodeValue(first));
	}

	function toggleChecked(value: string, isBranch: boolean): void {
		commitChecked(
			isBranch
				? toggleBranchChecked(collection(), value, checkedValue())
				: checkedValue().includes(value)
					? removeAll(checkedValue(), value)
					: uniq([...checkedValue(), value])
		);
	}

	const typeahead = createTreeTypeahead(typeaheadItems);

	const isTypingAhead = () => typeahead.typing;

	function typeaheadKey(key: string): void {
		if (getProps().typeahead === false) return;
		const match = typeahead.onKey(key, focusedValue() ?? undefined);
		if (match === undefined) return;
		focusAndScroll(match);
	}

	function typeaheadItems() {
		return getVisibleNodes().map(({ node }) => ({
			value: collection().getNodeValue(node),
			label: collection().stringifyNode(node)
		}));
	}

	function eventKey(event: KeyboardEvent): string {
		const key = NORMALIZED_KEYS[event.key] ?? event.key;
		if (dir() !== 'rtl') return key;
		if (key === 'ArrowLeft') return 'ArrowRight';
		if (key === 'ArrowRight') return 'ArrowLeft';
		return key;
	}

	function dispatchNodeAction(
		value: string,
		isBranch: boolean,
		modifiers: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }
	): void {
		const multiple = isMultiple();

		if ((modifiers.metaKey || modifiers.ctrlKey) && multiple) {
			toggleNodeSelection(value);
			return;
		}
		if (modifiers.shiftKey && multiple) {
			extendSelectionToNode(value);
			return;
		}
		if (isBranch && getProps().expandOnClick !== false) {
			selectNode(value);
			toggleBranchNode(value);
			return;
		}
		selectNode(value);
	}

	function treeKeydown(event: KeyboardEvent): void {
		if (event.defaultPrevented) return;
		if (event.isComposing) return;

		const target = event.target;
		if (isEditableElement(target)) return;

		const nodeElement = (target as HTMLElement | null)?.closest<HTMLElement>(
			'[data-part="branch-control"], [data-part="item"]'
		);
		if (!nodeElement) return;

		const value = nodeElement.dataset.value;
		if (value == null) return;

		const isBranchNode = nodeElement.matches('[data-part="branch-control"]');
		const disabled = nodeElement.dataset.disabled !== undefined;
		const modifier = event.ctrlKey || event.altKey || event.metaKey;
		const key = eventKey(event);

		switch (key) {
			case 'ArrowDown':
				if (modifier) return;
				event.preventDefault();
				if (event.shiftKey && isMultiple()) {
					focusTreeNextNode(value);
					extendSelectionToNextNode(value);
					return;
				}
				focusTreeNextNode(value);
				return;
			case 'ArrowUp':
				if (modifier) return;
				event.preventDefault();
				if (event.shiftKey && isMultiple()) {
					focusTreePrevNode(value);
					extendSelectionToPrevNode(value);
					return;
				}
				focusTreePrevNode(value);
				return;
			case 'ArrowLeft':
				if (modifier || disabled) return;
				event.preventDefault();
				if (isBranchNode && expandedValue().includes(value)) collapseBranch(value);
				else focusBranchNode(value);
				return;
			case 'ArrowRight':
				if (!isBranchNode || disabled) return;
				event.preventDefault();
				if (focusedValue() === value && expandedValue().includes(value)) focusBranchFirstNode(value);
				else expandBranch(value);
				return;
			case 'Home':
				if (modifier) return;
				event.preventDefault();
				if (event.shiftKey && isMultiple()) {
					extendSelectionToFirstNode();
					focusTreeFirstNode();
					return;
				}
				focusTreeFirstNode();
				return;
			case 'End':
				if (modifier) return;
				event.preventDefault();
				if (event.shiftKey && isMultiple()) {
					extendSelectionToLastNode();
					focusTreeLastNode();
					return;
				}
				focusTreeLastNode();
				return;
			case 'Space':
				if (disabled) return;
				if (isTypingAhead()) {
					typeaheadKey(event.key);
					return;
				}
				event.preventDefault();
				dispatchNodeAction(value, isBranchNode, {
					shiftKey: false,
					ctrlKey: false,
					metaKey: false
				});
				return;
			case 'Enter':
				if (disabled) return;
				if (isAnchorElement(target) && modifier) return;
				if (!isAnchorElement(target)) event.preventDefault();
				dispatchNodeAction(value, isBranchNode, {
					shiftKey: false,
					ctrlKey: false,
					metaKey: false
				});
				return;
			case '*':
				if (disabled) return;
				event.preventDefault();
				expandSiblingBranches(value);
				return;
			case 'F2': {
				if (disabled) return;
				const canRename = getProps().canRename;
				if (!canRename) return;
				const indexPath = collection().getIndexPath(value);
				if (indexPath) {
					const node = collection().at(indexPath);
					if (node !== undefined && !canRename(node, indexPath)) return;
				}
				event.preventDefault();
				startRenaming(value);
				return;
			}
			default:
				break;
		}

		if (key === 'a') {
			if (!event.metaKey || disabled) return;
			event.preventDefault();
			if (!isMultiple()) return;
			commitSelected(collection().getValues());
			focusTreeLastNode();
			return;
		}

		if (event.key.length !== 1 || event.ctrlKey || event.metaKey) return;
		typeaheadKey(event.key);
		event.preventDefault();
	}

	function syncRenameInput(): void {
		raf(() => {
			const value = renamingValue;
			if (!value) return;
			const node = collection().findNode(value);
			if (node === undefined) return;
			const input = byId(renameInputId(value)) as HTMLInputElement | null;
			if (!input) return;
			input.value = collection().stringifyNode(node);
		});
	}

	function focusRenameInput(): void {
		raf(() => {
			const value = renamingValue;
			if (!value) return;
			const input = byId(renameInputId(value)) as HTMLInputElement | null;
			if (!input) return;
			input.focus();
			input.select();
		});
	}

	function startRenaming(value: string): void {
		renamingValue = value;
		const indexPath = collection().getIndexPath(value);
		const node = indexPath ? collection().at(indexPath) : undefined;
		if (node !== undefined && indexPath) {
			getProps().onRenameStart?.({ value, node, indexPath });
		}
		syncRenameInput();
		focusRenameInput();
	}

	function submitRenaming(value: string, label: string): void {
		const target = renamingValue ?? value;
		if (!target) return;

		const indexPath = collection().getIndexPath(target);
		if (!indexPath) return;

		const trimmed = label.trim();
		if (!trimmed) return;

		const onBeforeRename = getProps().onBeforeRename;
		if (onBeforeRename && !onBeforeRename({ value: target, label: trimmed, indexPath })) {
			renamingValue = null;
			focusNode(target);
			return;
		}

		getProps().onRenameComplete?.({ value: target, label: trimmed, indexPath });
		renamingValue = null;
		focusNode(target);
	}

	function submitRenameLabel(label: string): void {
		if (!renamingValue) return;
		submitRenaming(renamingValue, label);
	}

	function cancelRenaming(): void {
		const value = renamingValue;
		renamingValue = null;
		if (value) focusNode(value);
	}

	$effect(() => () => {
		pendingAborts.forEach((controller) => controller.abort());
		pendingAborts.clear();
	});

	return {
		get collection() {
			return collection();
		},
		get dir() {
			return dir();
		},
		getVisibleNodes,
		getNodeState,
		getCheckedMap: () => getCheckedValueMap(collection(), checkedValue()),
		setExpandedValue(value) {
			commitExpanded(uniq(value));
		},
		setSelectedValue(value) {
			commitSelected(uniq(value));
		},
		expand(value) {
			commitExpandBranches(value ?? collection().getBranchValues());
		},
		collapse(value) {
			commitExpanded(value ? removeAll(expandedValue(), ...value) : []);
		},
		select(value) {
			if (!value) {
				if (isMultiple()) commitSelected(collection().getValues());
				return;
			}
			commitSelected(uniq([...selectedValue(), ...value]));
		},
		deselect(value) {
			commitSelected(value ? removeAll(selectedValue(), ...value) : []);
		},
		focus(value) {
			focusNode(value);
		},
		selectParent(value) {
			const parent = collection().getParentNode(value);
			if (parent === undefined) return;
			commitSelected(uniq([...selectedValue(), collection().getNodeValue(parent)]));
		},
		expandParent(value) {
			const parent = collection().getParentNode(value);
			if (parent === undefined) return;
			commitExpanded(uniq([...expandedValue(), collection().getNodeValue(parent)]));
		},
		toggleChecked,
		setChecked(value) {
			commitChecked(value);
		},
		clearChecked() {
			commitChecked([]);
		},
		startRenaming,
		submitRenaming,
		cancelRenaming,
		registerTree(node) {
			treeNode = node;
		},
		getRootProps() {
			return { id: rootId(), dir: dir() ?? undefined };
		},
		getLabelProps() {
			return { id: labelId(), dir: dir() ?? undefined };
		},
		getTreeProps() {
			return dropUndefined({
				id: treeId(),
				dir: dir() ?? undefined,
				role: 'tree',
				'aria-label': treeLabel(),
				'aria-labelledby': labelId(),
				'aria-multiselectable': isMultiple() || undefined,
				tabindex: -1,
				onkeydown: treeKeydown
			});
		},
		getItemProps(props) {
			const state = getNodeState(props);
			return dropUndefined({
				id: state.id,
				dir: dir() ?? undefined,
				'data-ownedby': treeId(),
				'data-path': state.indexPath.join('/'),
				'data-value': state.value,
				tabindex: state.focused ? 0 : -1,
				'data-focus': dataAttr(state.focused),
				role: 'treeitem',
				'aria-current': state.selected ? 'true' : undefined,
				'aria-selected': state.disabled ? undefined : state.selected,
				'data-selected': dataAttr(state.selected),
				'aria-disabled': state.disabled || undefined,
				'data-disabled': dataAttr(state.disabled),
				'data-renaming': dataAttr(state.renaming),
				'data-checked': dataAttr(state.checked === true),
				'data-indeterminate': dataAttr(state.checked === 'indeterminate'),
				'aria-level': state.depth,
				'data-depth': state.depth,
				style: `--depth: ${state.depth}`,
				onfocus(event: FocusEvent) {
					event.stopPropagation();
					commitFocused(state.value);
				},
				onclick(event: MouseEvent) {
					if (state.disabled) return;
					if (event.button !== 0) return;
					if (isAnchorElement(event.currentTarget) && (event.ctrlKey || event.altKey || event.metaKey))
						return;
					dispatchNodeAction(state.value, false, event);
					event.stopPropagation();
					if (!isAnchorElement(event.currentTarget)) event.preventDefault();
				}
			});
		},
		getItemTextProps(props) {
			const state = getNodeState(props);
			return {
				'data-disabled': dataAttr(state.disabled),
				'data-selected': dataAttr(state.selected),
				'data-focus': dataAttr(state.focused)
			};
		},
		getItemIndicatorProps(props) {
			const state = getNodeState(props);
			return {
				'aria-hidden': true,
				'data-disabled': dataAttr(state.disabled),
				'data-selected': dataAttr(state.selected),
				'data-focus': dataAttr(state.focused),
				hidden: !state.selected
			};
		},
		getBranchProps(props) {
			const state = getNodeState(props);
			return {
				'dir': dir() ?? undefined,
				'data-depth': state.depth,
				'data-branch': state.value,
				'role': 'treeitem',
				'data-ownedby': treeId(),
				'data-value': state.value,
				'aria-level': state.depth,
				'aria-selected': state.disabled ? undefined : state.selected,
				'data-path': state.indexPath.join('/'),
				'data-selected': dataAttr(state.selected),
				'aria-expanded': state.expanded,
				'data-state': state.expanded ? 'open' : 'closed',
				'aria-disabled': state.disabled || undefined,
				'data-disabled': dataAttr(state.disabled),
				'data-loading': dataAttr(state.loading),
				'aria-busy': state.loading || undefined,
				style: `--depth: ${state.depth}`
			};
		},
		getBranchIndicatorProps(props) {
			const state = getNodeState(props);
			return {
				'aria-hidden': true,
				'data-state': state.expanded ? 'open' : 'closed',
				'data-disabled': dataAttr(state.disabled),
				'data-selected': dataAttr(state.selected),
				'data-focus': dataAttr(state.focused),
				'data-loading': dataAttr(state.loading)
			};
		},
		getBranchTriggerProps(props) {
			const state = getNodeState(props);
			return {
				'role': 'button',
				'dir': dir() ?? undefined,
				'data-disabled': dataAttr(state.disabled),
				'data-state': state.expanded ? 'open' : 'closed',
				'data-value': state.value,
				'data-loading': dataAttr(state.loading),
				disabled: state.loading,
				onclick(event: MouseEvent) {
					if (state.disabled || state.loading) return;
					toggleBranchNode(state.value);
					event.stopPropagation();
				}
			};
		},
		getBranchControlProps(props) {
			const state = getNodeState(props);
			return dropUndefined({
				role: 'button',
				id: state.id,
				dir: dir() ?? undefined,
				tabindex: state.focused ? 0 : -1,
				'data-path': state.indexPath.join('/'),
				'data-state': state.expanded ? 'open' : 'closed',
				'data-disabled': dataAttr(state.disabled),
				'data-selected': dataAttr(state.selected),
				'data-focus': dataAttr(state.focused),
				'data-renaming': dataAttr(state.renaming),
				'data-checked': dataAttr(state.checked === true),
				'data-indeterminate': dataAttr(state.checked === 'indeterminate'),
				'data-value': state.value,
				'data-depth': state.depth,
				'data-loading': dataAttr(state.loading),
				'aria-busy': state.loading || undefined,
				onfocus(event: FocusEvent) {
					commitFocused(state.value);
					event.stopPropagation();
				},
				onclick(event: MouseEvent) {
					if (state.disabled || state.loading) return;
					if (event.button !== 0) return;
					if (isAnchorElement(event.currentTarget) && (event.ctrlKey || event.altKey || event.metaKey))
						return;
					dispatchNodeAction(state.value, true, event);
					event.stopPropagation();
				}
			});
		},
		getBranchTextProps(props) {
			const state = getNodeState(props);
			return {
				'dir': dir() ?? undefined,
				'data-disabled': dataAttr(state.disabled),
				'data-state': state.expanded ? 'open' : 'closed',
				'data-loading': dataAttr(state.loading)
			};
		},
		getBranchContentProps(props) {
			const state = getNodeState(props);
			return {
				'role': 'group',
				'dir': dir() ?? undefined,
				'data-state': state.expanded ? 'open' : 'closed',
				'data-collapsible': '',
				'data-depth': state.depth,
				'data-path': state.indexPath.join('/'),
				'data-value': state.value,
				hidden: !state.expanded
			};
		},
		getBranchIndentGuideProps(props) {
			const state = getNodeState(props);
			return { 'data-depth': state.depth };
		},
		getNodeCheckboxProps(props) {
			const state = getNodeState(props);
			const checked = state.checked;
			return {
				'tabindex': -1,
				'role': 'checkbox',
				'data-state': checked === true ? 'checked' : checked === false ? 'unchecked' : 'indeterminate',
				'aria-checked': checked === true ? 'true' : checked === false ? 'false' : 'mixed',
				'data-disabled': dataAttr(state.disabled),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (state.disabled) return;
					if (event.button !== 0) return;
					toggleChecked(state.value, state.isBranch);
					event.stopPropagation();
					(event.currentTarget as HTMLElement)
						.closest<HTMLElement>('[role=treeitem]')
						?.focus({ preventScroll: true });
				}
			};
		},
		getNodeRenameInputProps(props) {
			const state = getNodeState(props);
			return {
				id: renameInputId(state.value),
				type: 'text',
				'aria-label': renameInputLabel(),
				hidden: !state.renaming,
				onkeydown(event: KeyboardEvent) {
					if (event.isComposing) return;
					if (event.key === 'Escape') {
						cancelRenaming();
						event.preventDefault();
					}
					if (event.key === 'Enter') {
						submitRenameLabel((event.currentTarget as HTMLInputElement).value);
						event.preventDefault();
					}
					event.stopPropagation();
				},
				onblur(event: FocusEvent) {
					if (!renamingValue) return;
					submitRenameLabel((event.currentTarget as HTMLInputElement).value);
				}
			};
		},
		get expandedValue() {
			return expandedValue();
		},
		get selectedValue() {
			return selectedValue();
		},
		get checkedValue() {
			return checkedValue();
		},
		get focusedValue(): string | null {
			return focusedValue() ?? null;
		},
		get renamingValue() {
			return renamingValue;
		}
	};
}
