<script lang="ts">
	import {
		createTreeCollection,
		createTreeView,
		TreeViewBranch,
		TreeViewBranchContent,
		TreeViewBranchControl,
		TreeViewBranchIndicator,
		TreeViewBranchText,
		TreeViewItem,
		TreeViewItemText,
		TreeViewLabel,
		TreeViewNode,
		TreeViewRootProvider,
		TreeViewTree
	} from '../../src/lib/components/tree-view/index';

	interface Item {
		value: string;
		label: string;
		children?: Item[];
	}

	const collection = createTreeCollection<Item>({
		rootNode: {
			value: 'ROOT',
			label: '',
			children: [
				{ value: 'alpha', label: 'Alpha', children: [{ value: 'alpha/one', label: 'Alpha One' }] },
				{ value: 'beta', label: 'Beta', children: [{ value: 'beta/one', label: 'Beta One' }] }
			]
		}
	});

	const uid = $props.id();
	const api = createTreeView<Item>(() => ({ collection, defaultExpandedValue: ['alpha'] }), uid);
</script>

{#snippet renderNode(node: Item, indexPath: number[])}
	<TreeViewNode {node} {indexPath}>
		{#snippet children({ node: current, indexPath: currentPath, state })}
			{#if state.isBranch}
				<TreeViewBranch>
					<TreeViewBranchControl>
						<TreeViewBranchIndicator />
						<TreeViewBranchText>{current.label}</TreeViewBranchText>
					</TreeViewBranchControl>
					<TreeViewBranchContent>
						{#each current.children ?? [] as child, index (child.value)}
							{@render renderNode(child, [...currentPath, index])}
						{/each}
					</TreeViewBranchContent>
				</TreeViewBranch>
			{:else}
				<TreeViewItem>
					<TreeViewItemText>{current.label}</TreeViewItemText>
				</TreeViewItem>
			{/if}
		{/snippet}
	</TreeViewNode>
{/snippet}

<TreeViewRootProvider value={api}>
	<TreeViewLabel>Provider tree</TreeViewLabel>
	<TreeViewTree>
		{#each (collection.rootNode.children ?? []) as node, index (node.value)}
			{@render renderNode(node, [index])}
		{/each}
	</TreeViewTree>
	<button
		data-testid="expand-beta"
		onclick={() => {
			api.expand(['beta']);
			api.select(['alpha/one']);
		}}>Expand beta</button
	>
</TreeViewRootProvider>
