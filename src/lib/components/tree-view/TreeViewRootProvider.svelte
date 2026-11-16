<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TreeNode } from './collection';
	import type { TreeViewApi } from './tree-view.state.svelte';

	export interface TreeViewRootProviderProps<T extends TreeNode = TreeNode>
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: TreeViewApi<T>;
	}
</script>

<script lang="ts" generics="T extends TreeNode = TreeNode">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './TreeView.module.css';
	import { setTreeViewContext, type TreeViewContextApi } from './tree-view.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: TreeViewRootProviderProps<T> = $props();

	// The value is the api the consumer created; descendants read the shared node surface.
	const api = untrack(() => value) as unknown as TreeViewContextApi;
	setTreeViewContext(api);
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
	data-slot="tree-view-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
