<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewBranchTriggerProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { ChevronRightIcon } from '../../internal/icons/index.js';
	import styles from './TreeView.module.css';
	import { useTreeViewContext, useTreeViewNodePropsContext } from './tree-view.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TreeViewBranchTriggerProps = $props();

	const api = useTreeViewContext();
	const nodeProps = useTreeViewNodePropsContext();
	const attrs = $derived(api.getBranchTriggerProps(nodeProps()));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="branch-trigger"
	data-slot="tree-view-branch-trigger"
	class={cn(styles.branchTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronRightIcon />
	{/if}
</Element>
