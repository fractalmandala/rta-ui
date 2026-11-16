<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { JsonNodeHastElement } from './json';

	export interface JsonTreeViewValueNodeProps {
		node: JsonNodeHastElement;
		renderValue?: Snippet<[JsonNodeHastElement]>;
	}
</script>

<script lang="ts">
	import JsonTreeViewValueNode from './JsonTreeViewValueNode.svelte';

	let { node, renderValue }: JsonTreeViewValueNodeProps = $props();
</script>

{#if node.type === 'text'}
	{#if renderValue}
		{@render renderValue(node)}
	{:else}
		{node.value}
	{/if}
{:else}
	<svelte:element
		this={node.tagName}
		data-root={node.properties.root ? '' : undefined}
		data-type={node.properties.nodeType}
		data-kind={node.properties.kind}
	>
		{#each node.children as child, index (index)}
			<JsonTreeViewValueNode node={child} {renderValue} />
		{/each}
	</svelte:element>
{/if}
