<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewLabelProps
		extends HTMLProps<'h3'>, PolymorphicProps<'h3'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './TreeView.module.css';
	import { useTreeViewContext } from './tree-view.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: TreeViewLabelProps =
		$props();

	const api = useTreeViewContext();
	const attrs = $derived(api.getLabelProps());
</script>

<Element
	as="h3"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="label"
	data-slot="tree-view-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
