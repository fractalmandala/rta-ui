<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseJsonTreeViewProps } from './json-tree-view.state.svelte';

	export interface JsonTreeViewRootProps
		extends Omit<UseJsonTreeViewProps, 'collection' | 'typeahead'>,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}

</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { setTreeViewContext, type TreeViewContextApi } from '../tree-view/tree-view.state.svelte';
	import styles from './JsonTreeView.module.css';
	import {
		createJsonTreeView,
		setJsonTreeViewPropsContext
	} from './json-tree-view.state.svelte';

	let {
		asChild,
		canRename,
		checkedValue = $bindable(),
		children,
		class: className,
		collapseStringsAfterLength,
		data,
		defaultCheckedValue,
		defaultExpandedDepth,
		defaultExpandedValue,
		defaultFocusedValue,
		defaultSelectedValue,
		dir,
		expandOnClick,
		expandedValue = $bindable(),
		focusedValue = $bindable(),
		groupArraysAfterLength,
		id,
		ids,
		loadChildren,
		maxPreviewItems,
		onBeforeRename,
		onCheckedChange,
		onExpandedChange,
		onFocusChange,
		onLoadChildrenComplete,
		onLoadChildrenError,
		onRenameComplete,
		onRenameStart,
		onSelectionChange,
		quotesOnKeys,
		ref = $bindable(null),
		scrollToIndexFn,
		selectedValue = $bindable(),
		selectionMode,
		showNonenumerable,
		translations,
		...props
	}: JsonTreeViewRootProps = $props();

	const uid = $props.id();
	const api = createJsonTreeView(
		() => ({
			canRename,
			collapseStringsAfterLength,
			data,
			defaultCheckedValue,
			defaultExpandedDepth,
			defaultExpandedValue,
			defaultFocusedValue,
			defaultSelectedValue,
			dir,
			expandOnClick,
			expandedValue,
			focusedValue,
			groupArraysAfterLength,
			id,
			ids,
			loadChildren,
			maxPreviewItems,
			onBeforeRename,
			onLoadChildrenComplete,
			onLoadChildrenError,
			onRenameComplete,
			onRenameStart,
			quotesOnKeys,
			scrollToIndexFn,
			selectedValue,
			selectionMode,
			showNonenumerable,
			translations,
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
	setTreeViewContext(api as unknown as TreeViewContextApi);
	setJsonTreeViewPropsContext(() => api.options);

	const attrs = $derived(api.getRootProps());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="json-tree-view"
	data-part="root"
	data-slot="json-tree-view-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
