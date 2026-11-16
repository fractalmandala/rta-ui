<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewBranchIndentGuideProps
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
	}: TreeViewBranchIndentGuideProps = $props();

	const api = useTreeViewContext();
	const nodeProps = useTreeViewNodePropsContext();
	const attrs = $derived(api.getBranchIndentGuideProps(nodeProps()));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="branch-indent-guide"
	data-slot="tree-view-branch-indent-guide"
	class={cn(styles.branchIndentGuide, className)}
>
	{@render children?.()}
</Element>
