<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { JsonNode } from './json';
	import type { JsonTreeViewNodeBaseProps } from './JsonTreeViewNode.svelte';

	export interface JsonTreeViewTreeBaseProps extends JsonTreeViewNodeBaseProps {}

	export interface JsonTreeViewTreeProps
		extends JsonTreeViewTreeBaseProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { ChevronRightIcon } from '../../internal/icons/index.js';
	import { useTreeViewContext } from '../tree-view/tree-view.state.svelte';
	import styles from './JsonTreeView.module.css';
	import JsonTreeViewNode from './JsonTreeViewNode.svelte';

	let {
		arrow,
		asChild,
		class: className,
		indentGuide,
		ref = $bindable(null),
		renderValue,
		...props
	}: JsonTreeViewTreeProps = $props();

	const api = useTreeViewContext();
	const attrs = $derived(api.getTreeProps());
	const nodes = $derived(
		api.collection.getNodeChildren(api.collection.rootNode) as unknown as JsonNode[]
	);
</script>

{#snippet defaultArrow()}
	<ChevronRightIcon aria-hidden="true" />
{/snippet}

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="json-tree-view"
	data-part="tree"
	data-slot="json-tree-view-tree"
	class={cn(styles.tree, className)}
>
	{#each nodes as node, index (index)}
		<JsonTreeViewNode
			{node}
			indexPath={[index]}
			arrow={arrow ?? defaultArrow}
			{indentGuide}
			{renderValue}
		/>
	{/each}
</Element>
