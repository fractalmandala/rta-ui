<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TreeViewNodeState } from './tree-view.state.svelte';

	export interface TreeViewNodeContextProps {
		render: Snippet<[() => TreeViewNodeState]>;
	}
</script>

<script lang="ts">
	import { useTreeViewNodeContext } from './tree-view.state.svelte';

	const { render }: TreeViewNodeContextProps = $props();

	const nodeState = useTreeViewNodeContext();
</script>

{@render render(nodeState)}
