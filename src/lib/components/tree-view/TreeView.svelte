<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TreeNode } from './collection';
	import type { UseTreeViewProps } from './tree-view.state.svelte';

	export interface TreeViewRootProps<T extends TreeNode = TreeNode>
		extends UseTreeViewProps<T>, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts" generics="T extends TreeNode = TreeNode">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './TreeView.module.css';
	import {
		createTreeView,
		setTreeViewContext,
		type TreeViewContextApi
	} from './tree-view.state.svelte';

	let {
		asChild,
		canRename,
		checkedValue = $bindable(),
		children,
		class: className,
		collection,
		defaultCheckedValue,
		defaultExpandedValue,
		defaultFocusedValue,
		defaultSelectedValue,
		dir,
		expandOnClick,
		expandedValue = $bindable(),
		focusedValue = $bindable(),
		id,
		ids,
		loadChildren,
		onBeforeRename,
		onCheckedChange,
		onExpandedChange,
		onFocusChange,
		onLoadChildrenComplete,
		onLoadChildrenError,
		onRenameComplete,
		onRenameStart,
		onSelectionChange,
		ref = $bindable(null),
		scrollToIndexFn,
		selectedValue = $bindable(),
		selectionMode,
		translations,
		typeahead,
		...props
	}: TreeViewRootProps<T> = $props();

	const uid = $props.id();
	const api = createTreeView<T>(
		() => ({
			canRename,
			collection,
			defaultCheckedValue,
			defaultExpandedValue,
			defaultFocusedValue,
			defaultSelectedValue,
			dir,
			expandOnClick,
			expandedValue,
			focusedValue,
			id,
			ids,
			loadChildren,
			onBeforeRename,
			onLoadChildrenComplete,
			onLoadChildrenError,
			onRenameComplete,
			onRenameStart,
			scrollToIndexFn,
			selectedValue,
			selectionMode,
			translations,
			typeahead,
			checkedValue,
			onExpandedChange(details) {
				expandedValue = details.expandedValue;
				onExpandedChange?.(details);
			},
			onSelectionChange(details) {
				selectedValue = details.selectedValue;
				onSelectionChange?.(details);
			},
			onCheckedChange(details) {
				checkedValue = details.checkedValue;
				onCheckedChange?.(details);
			},
			onFocusChange(details) {
				focusedValue = details.focusedValue;
				onFocusChange?.(details);
			}
		}),
		uid
	);
	// The api is generic over the consumer node type; descendants only read the shared node surface.
	setTreeViewContext(api as unknown as TreeViewContextApi);

	const attrs = $derived(api.getRootProps());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="root"
	data-slot="tree-view-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
