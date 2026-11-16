<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { JsonNode, JsonNodeHastElement } from './json';

	export interface JsonTreeViewNodeBaseProps {
		/** Icon shown before an expandable branch. */
		arrow?: Snippet;
		/** `true` for the default indent guide, or a snippet for custom guide content. */
		indentGuide?: boolean | Snippet;
		/** Replaces the rendered value of a leaf or preview. */
		renderValue?: Snippet<[JsonNodeHastElement]>;
	}

	export interface JsonTreeViewNodeProps extends JsonTreeViewNodeBaseProps {
		node: JsonNode;
		indexPath: number[];
	}

	export interface JsonTreeViewNodeElementProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useTreeViewContext } from '../tree-view/tree-view.state.svelte';
	import { getAccessibleDescription, jsonNodeToElement, keyPathToKey } from './json';
	import { useJsonTreeViewPropsContext } from './json-tree-view.state.svelte';
	import JsonTreeViewKeyNode from './JsonTreeViewKeyNode.svelte';
	import JsonTreeViewNode from './JsonTreeViewNode.svelte';
	import JsonTreeViewValueNode from './JsonTreeViewValueNode.svelte';

	let { arrow, indentGuide, indexPath, node, renderValue }: JsonTreeViewNodeProps = $props();

	const api = useTreeViewContext();
	const options = useJsonTreeViewPropsContext();

	const nodeProps = $derived({ node, indexPath });
	const state = $derived(api.getNodeState(nodeProps));
	const key = $derived(keyPathToKey(node.keyPath, { excludeRoot: true }));
	const valueNode = $derived(jsonNodeToElement(node, options()));
	const label = $derived(getAccessibleDescription(node));
	const line = $derived(indexPath.reduce((total, current) => total + current, 1));
	const lineStyle = $derived(`--line-length: ${indexPath.length - 1}`);

	const branchAttrs = $derived(api.getBranchProps(nodeProps));
	const branchControlAttrs = $derived(api.getBranchControlProps(nodeProps));
	const branchIndicatorAttrs = $derived(api.getBranchIndicatorProps(nodeProps));
	const branchTextAttrs = $derived(api.getBranchTextProps(nodeProps));
	const branchContentAttrs = $derived(api.getBranchContentProps(nodeProps));
	const branchIndentGuideAttrs = $derived(api.getBranchIndentGuideProps(nodeProps));
	const itemAttrs = $derived(api.getItemProps(nodeProps));
	const itemTextAttrs = $derived(api.getItemTextProps(nodeProps));
</script>

{#if state.isBranch}
	<Element as="div" {...branchAttrs} data-scope="json-tree-view" data-part="branch">
		<Element
			as="div"
			{...branchControlAttrs}
			data-scope="json-tree-view"
			data-part="branch-control"
			aria-label={label}
			data-line={line}
			style={mergeStyleDeclarations(branchControlAttrs.style, lineStyle)}
		>
			{#if arrow}
				<Element
					as="div"
					{...branchIndicatorAttrs}
					data-scope="json-tree-view"
					data-part="branch-indicator"
				>
					{@render arrow()}
				</Element>
			{/if}
			<Element
				as="span"
				{...branchTextAttrs}
				data-scope="json-tree-view"
				data-part="branch-text"
			>
				{#if key}
					<JsonTreeViewKeyNode {node} showQuotes={options().quotesOnKeys} />
				{/if}
				<JsonTreeViewValueNode node={valueNode} {renderValue} />
			</Element>
		</Element>
		<Element
			as="div"
			{...branchContentAttrs}
			data-scope="json-tree-view"
			data-part="branch-content"
		>
			{#if typeof indentGuide === 'boolean'}
				<Element
					as="div"
					{...branchIndentGuideAttrs}
					data-scope="json-tree-view"
					data-part="branch-indent-guide"
				></Element>
			{:else if indentGuide}
				{@render indentGuide()}
			{/if}
			{#each node.children ?? [] as child, index (index)}
				<JsonTreeViewNode
					node={child}
					indexPath={[...indexPath, index]}
					{arrow}
					{indentGuide}
					{renderValue}
				/>
			{/each}
		</Element>
	</Element>
{:else}
	<Element
		as="div"
		{...itemAttrs}
		data-scope="json-tree-view"
		data-part="item"
		aria-label={label}
		data-line={line}
		style={mergeStyleDeclarations(itemAttrs.style, lineStyle)}
	>
		<Element as="span" {...itemTextAttrs} data-scope="json-tree-view" data-part="item-text">
			{#if key}
				<JsonTreeViewKeyNode {node} showQuotes={options().quotesOnKeys} />
			{/if}
			<JsonTreeViewValueNode node={valueNode} {renderValue} />
		</Element>
	</Element>
{/if}
