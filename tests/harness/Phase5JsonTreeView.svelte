<script lang="ts">
	import {
		JsonTreeView,
		JsonTreeViewTree,
		type JsonNodeHastElement
	} from '../../src/lib/components/json-tree-view/index';
	import type { TreeViewExpandedChangeDetails } from '../../src/lib/components/tree-view/index';

	const dataset: Record<string, unknown> = {
		environment: 'production',
		release: { branch: 'main', commit: '0f4c9d7', status: 'ready' },
		services: ['docs', 'registry', 'website'],
		rollout: { canary: true, percentage: 25 }
	};

	function contains(value: unknown, query: string): boolean {
		return JSON.stringify(value)?.toLowerCase().includes(query) ?? false;
	}

	function filterEntries(value: unknown, query: string): unknown {
		if (!query) return value;
		if (Array.isArray(value)) {
			return value
				.filter((entry) => contains(entry, query))
				.map((entry) => filterEntries(entry, query));
		}
		if (value !== null && typeof value === 'object') {
			return Object.fromEntries(
				Object.entries(value as Record<string, unknown>)
					.filter(([key, entry]) => key.toLowerCase().includes(query) || contains(entry, query))
					.map(([key, entry]) => [key, filterEntries(entry, query)])
			);
		}
		return value;
	}

	let {
		data = undefined as unknown,
		query = '',
		defaultExpandedDepth = 2,
		maxPreviewItems = undefined as number | undefined,
		collapseStringsAfterLength = undefined as number | undefined,
		quotesOnKeys = false,
		indentGuide = false,
		customValue = false,
		selectionMode = 'single' as 'single' | 'multiple',
		onExpandedChange
	}: {
		data?: unknown;
		query?: string;
		defaultExpandedDepth?: number;
		maxPreviewItems?: number;
		collapseStringsAfterLength?: number;
		quotesOnKeys?: boolean;
		indentGuide?: boolean;
		customValue?: boolean;
		selectionMode?: 'single' | 'multiple';
		onExpandedChange?: (details: TreeViewExpandedChangeDetails) => void;
	} = $props();

	const inspected = $derived(filterEntries(data ?? dataset, query));
</script>

{#snippet renderStringValue(node: JsonNodeHastElement)}
	{#if node.type === 'text' && typeof node.value === 'string' && node.value.startsWith('"')}
		<em data-custom-value>{node.value}</em>
	{:else if node.type === 'text'}
		{node.value}
	{/if}
{/snippet}

<JsonTreeView
	data={inspected}
	{defaultExpandedDepth}
	{maxPreviewItems}
	{collapseStringsAfterLength}
	{quotesOnKeys}
	{selectionMode}
	onExpandedChange={(details) => onExpandedChange?.(details)}
>
	<JsonTreeViewTree indentGuide={indentGuide} renderValue={customValue ? renderStringValue : undefined} />
</JsonTreeView>
