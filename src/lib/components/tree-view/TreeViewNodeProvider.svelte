<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TreeNode } from './collection';

	export interface TreeViewNodeProviderProps {
		node: TreeNode;
		indexPath: number[];
		children?: Snippet;
	}
</script>

<script lang="ts">
	import {
		setTreeViewNodeContext,
		setTreeViewNodePropsContext,
		useTreeViewContext
	} from './tree-view.state.svelte';

	let { node, indexPath, children }: TreeViewNodeProviderProps = $props();

	const api = useTreeViewContext();

	setTreeViewNodePropsContext(() => ({ node, indexPath }));
	setTreeViewNodeContext(() => api.getNodeState({ node, indexPath }));
</script>

{@render children?.()}
