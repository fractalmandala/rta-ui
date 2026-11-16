<script lang="ts">
	import { keyPathToKey, type JsonNode } from './json';

	interface Props {
		node: JsonNode;
		showQuotes?: boolean;
	}

	let { node, showQuotes }: Props = $props();

	const key = $derived(keyPathToKey(node.keyPath));
</script>

<span data-kind="key" data-non-enumerable={node.isNonEnumerable ? '' : undefined}>
	{showQuotes ? `"${key}"` : key}
</span>
<span data-kind="colon">:</span>
