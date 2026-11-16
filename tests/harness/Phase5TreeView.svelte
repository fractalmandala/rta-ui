<script lang="ts">
	import {
		createTreeCollection,
		TreeView,
		TreeViewBranch,
		TreeViewBranchContent,
		TreeViewBranchControl,
		TreeViewBranchIndentGuide,
		TreeViewBranchIndicator,
		TreeViewBranchText,
		TreeViewItem,
		TreeViewItemIndicator,
		TreeViewItemText,
		TreeViewLabel,
		TreeViewNode,
		TreeViewNodeCheckbox,
		TreeViewNodeCheckboxIndicator,
		TreeViewNodeRenameInput,
		TreeViewTree,
		type TreeCollection,
		type TreeViewCheckedChangeDetails,
		type TreeViewExpandedChangeDetails,
		type TreeViewFocusChangeDetails,
		type TreeViewLoadChildrenDetails,
		type TreeViewRenameCompleteDetails,
		type TreeViewSelectionChangeDetails
	} from '../../src/lib/components/tree-view/index';

	interface FileNode {
		id: string;
		name: string;
		disabled?: boolean;
		children?: FileNode[];
		/** Loaded asynchronously by `loadChildren`. */
		childrenCount?: number;
	}

	const tree: FileNode = {
		id: 'ROOT',
		name: '',
		children: [
			{
				id: 'src',
				name: 'src',
				children: [
					{ id: 'src/App.tsx', name: 'App.tsx' },
					{
						id: 'src/components',
						name: 'components',
						children: [
							{ id: 'src/components/Button.tsx', name: 'Button.tsx' },
							{ id: 'src/components/Dialog.tsx', name: 'Dialog.tsx' }
						]
					}
				]
			},
			{ id: 'public', name: 'public', children: [{ id: 'public/favicon.svg', name: 'favicon.svg' }] },
			{ id: 'package.json', name: 'package.json' },
			{ id: 'README.md', name: 'README.md' },
			{ id: 'lazy', name: 'lazy', childrenCount: 1 },
			{ id: 'locked', name: 'locked', disabled: true }
		]
	};

	let {
		checkboxes = false,
		rename = false,
		selectionMode = 'single' as 'single' | 'multiple',
		defaultExpandedValue = [] as string[],
		defaultSelectedValue = undefined as string[] | undefined,
		defaultCheckedValue = undefined as string[] | undefined,
		expandedValue = undefined as string[] | undefined,
		selectedValue = undefined as string[] | undefined,
		focusedValue = undefined as string | null | undefined,
		loadChildren = undefined as
			| undefined
			| ((details: TreeViewLoadChildrenDetails<FileNode>) => Promise<FileNode[]>),
		canRename = undefined as undefined | ((node: FileNode) => boolean),
		onExpandedChange,
		onSelectionChange,
		onCheckedChange,
		onFocusChange,
		onRenameComplete,
		onLoadChildrenComplete
	}: {
		checkboxes?: boolean;
		rename?: boolean;
		selectionMode?: 'single' | 'multiple';
		defaultExpandedValue?: string[];
		defaultSelectedValue?: string[];
		defaultCheckedValue?: string[];
		expandedValue?: string[];
		selectedValue?: string[];
		focusedValue?: string | null;
		loadChildren?: (details: TreeViewLoadChildrenDetails<FileNode>) => Promise<FileNode[]>;
		canRename?: (node: FileNode) => boolean;
		onExpandedChange?: (details: TreeViewExpandedChangeDetails<FileNode>) => void;
		onSelectionChange?: (details: TreeViewSelectionChangeDetails<FileNode>) => void;
		onCheckedChange?: (details: TreeViewCheckedChangeDetails) => void;
		onFocusChange?: (details: TreeViewFocusChangeDetails<FileNode>) => void;
		onRenameComplete?: (details: TreeViewRenameCompleteDetails) => void;
		onLoadChildrenComplete?: () => void;
	} = $props();

	let collection = $state<TreeCollection<FileNode>>(
		createTreeCollection<FileNode>({
			nodeToValue: (node) => node.id,
			nodeToString: (node) => node.name,
			rootNode: tree
		})
	);
</script>

{#snippet renderNode(node: FileNode, indexPath: number[])}
	<TreeViewNode {node} {indexPath}>
		{#snippet children({ node: current, indexPath: currentPath, state })}
			{#if state.isBranch}
				<TreeViewBranch>
					<TreeViewBranchControl>
						<TreeViewBranchIndicator />
						{#if checkboxes}
							<TreeViewNodeCheckbox><TreeViewNodeCheckboxIndicator /></TreeViewNodeCheckbox>
						{/if}
						<TreeViewBranchText>{current.name}</TreeViewBranchText>
						{#if rename}<TreeViewNodeRenameInput />{/if}
					</TreeViewBranchControl>
					<TreeViewBranchContent>
						<TreeViewBranchIndentGuide />
						{#each current.children ?? [] as child, index (child.id)}
							{@render renderNode(child, [...currentPath, index])}
						{/each}
					</TreeViewBranchContent>
				</TreeViewBranch>
			{:else}
				<TreeViewItem>
					{#if checkboxes}
						<TreeViewNodeCheckbox><TreeViewNodeCheckboxIndicator /></TreeViewNodeCheckbox>
					{/if}
					<TreeViewItemText>{current.name}</TreeViewItemText>
					<TreeViewItemIndicator />
					{#if rename}<TreeViewNodeRenameInput />{/if}
				</TreeViewItem>
			{/if}
		{/snippet}
	</TreeViewNode>
{/snippet}

<TreeView
	{collection}
	{selectionMode}
	{defaultExpandedValue}
	{defaultSelectedValue}
	{defaultCheckedValue}
	{expandedValue}
	{selectedValue}
	{focusedValue}
	{loadChildren}
	{canRename}
	onExpandedChange={(details) => onExpandedChange?.(details)}
	onSelectionChange={(details) => onSelectionChange?.(details)}
	onCheckedChange={(details) => onCheckedChange?.(details)}
	onFocusChange={(details) => onFocusChange?.(details)}
	onRenameComplete={(details) => {
		const node = collection.at(details.indexPath);
		if (node) collection = collection.replace(details.indexPath, { ...node, name: details.label });
		onRenameComplete?.(details);
	}}
	onLoadChildrenComplete={(details) => {
		collection = details.collection;
		onLoadChildrenComplete?.();
	}}
>
	<TreeViewLabel>Project files</TreeViewLabel>
	<TreeViewTree>
		{#each (collection.rootNode.children ?? []) as node, index (node.id)}
			{@render renderNode(node, [index])}
		{/each}
	</TreeViewTree>
</TreeView>
