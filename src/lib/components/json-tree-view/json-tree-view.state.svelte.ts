import { createContext } from '../../internal/context';
import { createTreeCollection, type TreeCollection } from '../tree-view/collection';
import {
	createTreeView,
	type TreeViewApi,
	type UseTreeViewProps
} from '../tree-view/tree-view.state.svelte';
import { getRootNode, nodeToString, nodeToValue, type JsonNode, type JsonNodePreviewOptions } from './json';

export interface JsonTreeViewOptions extends Partial<JsonNodePreviewOptions> {
	quotesOnKeys?: boolean;
}

export interface UseJsonTreeViewProps
	extends Omit<UseTreeViewProps<JsonNode>, 'collection' | 'typeahead'>,
		JsonTreeViewOptions {
	/** The value to inspect. */
	data: unknown;
	/** How many levels of branches start expanded. */
	defaultExpandedDepth?: number;
}

export interface JsonTreeViewApi extends TreeViewApi<JsonNode> {
	readonly options: JsonTreeViewOptions;
}

export type UseJsonTreeViewReturn = JsonTreeViewApi;

export function getBranchValues(tree: TreeCollection<JsonNode>, depth: number): string[] {
	const values: string[] = [];
	tree.visit({
		onEnter: (node, indexPath) => {
			if (indexPath.length === 0) return;
			if (tree.isBranchNode(node) && indexPath.length <= depth) values.push(tree.getNodeValue(node));
		}
	});
	return values;
}

function resolveOptions(props: JsonTreeViewOptions): JsonTreeViewOptions {
	return {
		maxPreviewItems: props.maxPreviewItems,
		collapseStringsAfterLength: props.collapseStringsAfterLength,
		groupArraysAfterLength: props.groupArraysAfterLength,
		showNonenumerable: props.showNonenumerable,
		quotesOnKeys: props.quotesOnKeys
	};
}

const jsonTreeViewPropsContext = createContext<() => JsonTreeViewOptions>(
	'JsonTreeViewProps',
	'JsonTreeView.Root'
);
export const setJsonTreeViewPropsContext = (options: () => JsonTreeViewOptions) =>
	jsonTreeViewPropsContext.set(options);
export const useJsonTreeViewPropsContext = () => jsonTreeViewPropsContext.get();

export function createJsonTreeView(
	getProps: () => UseJsonTreeViewProps,
	uid: string
): JsonTreeViewApi {
	const collection = $derived(
		createTreeCollection<JsonNode>({
			nodeToValue,
			nodeToString,
			rootNode: getRootNode(getProps().data)
		})
	);

	const options = () => resolveOptions(getProps());

	const tree = createTreeView<JsonNode>(() => {
		const props = getProps();
		const depth = props.defaultExpandedDepth;
		const seededDefault =
			props.expandedValue === undefined && depth != null
				? getBranchValues(collection, depth)
				: undefined;
		return {
			id: props.id,
			ids: props.ids,
			dir: props.dir,
			translations: props.translations,
			expandedValue: props.expandedValue,
			defaultExpandedValue: seededDefault ?? props.defaultExpandedValue,
			selectedValue: props.selectedValue,
			defaultSelectedValue: props.defaultSelectedValue,
			checkedValue: props.checkedValue,
			defaultCheckedValue: props.defaultCheckedValue,
			focusedValue: props.focusedValue,
			defaultFocusedValue: props.defaultFocusedValue,
			selectionMode: props.selectionMode,
			expandOnClick: props.expandOnClick,
			loadChildren: props.loadChildren,
			canRename: props.canRename,
			scrollToIndexFn: props.scrollToIndexFn,
			onExpandedChange: props.onExpandedChange,
			onSelectionChange: props.onSelectionChange,
			onFocusChange: props.onFocusChange,
			onCheckedChange: props.onCheckedChange,
			onRenameStart: props.onRenameStart,
			onBeforeRename: props.onBeforeRename,
			onRenameComplete: props.onRenameComplete,
			onLoadChildrenComplete: props.onLoadChildrenComplete,
			onLoadChildrenError: props.onLoadChildrenError,
			collection,
			typeahead: false
		};
	}, uid);

	// Ark seeds `defaultExpandedValue` once. Re-seeding when the generated collection changes keeps
	// `defaultExpandedDepth` meaningful after the inspected value is replaced (filtered search, new
	// response). Controlled `expandedValue` wins and is never overwritten.
	let seeded: TreeCollection<JsonNode> | null = null;
	$effect(() => {
		const current = collection;
		if (seeded === null) {
			seeded = current;
			return;
		}
		if (current === seeded) return;
		seeded = current;
		const depth = getProps().defaultExpandedDepth;
		if (depth == null || getProps().expandedValue !== undefined) return;
		tree.setExpandedValue(getBranchValues(current, depth));
	});

	return {
		...tree,
		get collection() {
			return collection;
		},
		get dir() {
			return tree.dir;
		},
		get expandedValue() {
			return tree.expandedValue;
		},
		get selectedValue() {
			return tree.selectedValue;
		},
		get checkedValue() {
			return tree.checkedValue;
		},
		get focusedValue() {
			return tree.focusedValue;
		},
		get renamingValue() {
			return tree.renamingValue;
		},
		get options() {
			return options();
		}
	};
}
