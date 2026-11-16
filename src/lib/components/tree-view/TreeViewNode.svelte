<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TreeNode } from './collection';
	import type { TreeViewNodeProviderProps } from './TreeViewNodeProvider.svelte';
	import type { TreeViewNodeState } from './tree-view.state.svelte';

	export interface TreeViewNodeRenderProps<T extends TreeNode = TreeNode> {
		indexPath: number[];
		node: T;
		state: TreeViewNodeState;
	}

	export interface TreeViewNodeProps<T extends TreeNode = TreeNode>
		extends Omit<TreeViewNodeProviderProps, 'children'> {
		node: T;
		children?: Snippet<[TreeViewNodeRenderProps<T>]>;
	}
</script>

<script lang="ts" generics="T extends TreeNode = TreeNode">
	import {
		setTreeViewNodeContext,
		setTreeViewNodePropsContext,
		useTreeViewContext
	} from './tree-view.state.svelte';

	let { children, indexPath, node }: TreeViewNodeProps<T> = $props();

	const api = useTreeViewContext();

	setTreeViewNodePropsContext(() => ({ node, indexPath }));
	setTreeViewNodeContext(() => api.getNodeState({ node, indexPath }));
</script>

{@render children?.({ indexPath, node, state: api.getNodeState({ node, indexPath }) })}
