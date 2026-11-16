<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewNodeRenameInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './TreeView.module.css';
	import { useTreeViewContext, useTreeViewNodePropsContext } from './tree-view.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: TreeViewNodeRenameInputProps = $props();

	const api = useTreeViewContext();
	const nodeProps = useTreeViewNodePropsContext();
	const attrs = $derived(api.getNodeRenameInputProps(nodeProps()));
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="node-rename-input"
	data-slot="tree-view-node-rename-input"
	class={cn(styles.nodeRenameInput, className)}
/>
