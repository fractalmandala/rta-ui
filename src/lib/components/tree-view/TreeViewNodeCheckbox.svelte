<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewNodeCheckboxProps
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
	}: TreeViewNodeCheckboxProps = $props();

	const api = useTreeViewContext();
	const nodeProps = useTreeViewNodePropsContext();
	const attrs = $derived(api.getNodeCheckboxProps(nodeProps()));
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="node-checkbox"
	data-slot="tree-view-node-checkbox"
	class={cn(styles.nodeCheckbox, className)}
>
	{@render children?.()}
</Element>
