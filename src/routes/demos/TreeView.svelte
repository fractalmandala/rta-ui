<script lang="ts">
	import {
		createTreeCollection,
		TreeView,
		TreeViewBranch,
		TreeViewBranchContent,
		TreeViewBranchControl,
		TreeViewBranchIndicator,
		TreeViewBranchText,
		TreeViewItem,
		TreeViewItemText,
		TreeViewLabel,
		TreeViewNode,
		TreeViewTree
	} from '../../lib/components/tree-view/index';

	interface FileNode {
		id: string;
		name: string;
		children?: FileNode[];
	}

	const branchChildren = (node: FileNode): FileNode[] => node.children ?? [];

	const collection = createTreeCollection<FileNode>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.name,
		rootNode: {
			id: 'ROOT',
			name: '',
			children: [
				{
					id: 'src',
					name: 'src',
					children: [
						{ id: 'src/App.svelte', name: 'App.svelte' },
						{
							id: 'src/components',
							name: 'components',
							children: [{ id: 'src/components/Button.svelte', name: 'Button.svelte' }]
						}
					]
				},
				{ id: 'package.json', name: 'package.json' },
				{ id: 'README.md', name: 'README.md' }
			]
		}
	});
</script>

{#snippet renderNode(node: FileNode, indexPath: number[])}
	<TreeViewNode {node} {indexPath}>
		{#snippet children({ node: current, indexPath: currentPath, state })}
			{#if state.isBranch}
				<TreeViewBranch>
					<TreeViewBranchControl>
						<TreeViewBranchIndicator />
						<TreeViewBranchText>{current.name}</TreeViewBranchText>
					</TreeViewBranchControl>
					<TreeViewBranchContent>
						{#each branchChildren(current as unknown as FileNode) as child, index (child.id)}
							{@render renderNode(child, [...currentPath, index])}
						{/each}
					</TreeViewBranchContent>
				</TreeViewBranch>
			{:else}
				<TreeViewItem>
					<TreeViewItemText>{current.name}</TreeViewItemText>
				</TreeViewItem>
			{/if}
		{/snippet}
	</TreeViewNode>
{/snippet}

<TreeView {collection} defaultExpandedValue={['src']} selectionMode="multiple">
	<TreeViewLabel>Project files</TreeViewLabel>
	<TreeViewTree>
		{#each (collection.rootNode.children ?? []) as child, index (child.id)}
			{@render renderNode(child, [index])}
		{/each}
	</TreeViewTree>
</TreeView>
