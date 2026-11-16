<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewTreeProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './TreeView.module.css';
	import { useTreeViewContext } from './tree-view.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: TreeViewTreeProps =
		$props();

	const api = useTreeViewContext();
	const attrs = $derived(api.getTreeProps());

	$effect(() => {
		api.registerTree(ref as HTMLElement | null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="tree"
	data-slot="tree-view-tree"
	class={cn(styles.tree, className)}
>
	{@render children?.()}
</Element>
