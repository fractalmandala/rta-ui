<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewItemTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
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
	}: TreeViewItemTextProps = $props();

	const api = useTreeViewContext();
	const nodeProps = useTreeViewNodePropsContext();
	const attrs = $derived(api.getItemTextProps(nodeProps()));
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="item-text"
	data-slot="tree-view-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
