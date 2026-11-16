<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TreeViewNodeCheckboxIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		indeterminate?: Snippet;
		fallback?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { CheckIcon, IndeterminateIcon } from '../../internal/icons/index.js';
	import styles from './TreeView.module.css';
	import { useTreeViewNodeContext } from './tree-view.state.svelte';

	let {
		asChild,
		children,
		class: className,
		fallback,
		indeterminate,
		ref = $bindable(null),
		...props
	}: TreeViewNodeCheckboxIndicatorProps = $props();

	const nodeState = useTreeViewNodeContext();
	const checked = $derived(nodeState().checked);
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="tree-view"
	data-part="node-checkbox-indicator"
	data-slot="tree-view-node-checkbox-indicator"
	class={cn(styles.nodeCheckboxIndicator, className)}
>
	{#if checked === 'indeterminate'}
		{#if indeterminate}
			{@render indeterminate()}
		{:else}
			<IndeterminateIcon />
		{/if}
	{:else if checked === true}
		{#if children}
			{@render children()}
		{:else}
			<CheckIcon />
		{/if}
	{:else if fallback}
		{@render fallback()}
	{/if}
</Element>
