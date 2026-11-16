<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewBranchContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './TreeView.module.css';
	import { useTreeViewContext, useTreeViewNodePropsContext } from './tree-view.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TreeViewBranchContentProps = $props();

	const api = useTreeViewContext();
	const nodeProps = useTreeViewNodePropsContext();
	const attrs = $derived(api.getBranchContentProps(nodeProps()));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="branch-content"
	data-slot="tree-view-branch-content"
	class={cn(styles.branchContent, className)}
>
	{@render children?.()}
</Element>
