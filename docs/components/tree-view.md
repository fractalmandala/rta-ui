---
title: TreeView
component: tree-view
description: Browse folders, files, and other nested data in an expandable tree.
---

# TreeView

Browse folders, files, and other nested data in an expandable tree.

Port of `moduix/packages/svelte/src/components/tree-view` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `TreeViewContext` | `TreeViewContext.svelte` |
| `TreeViewNodeContext` | `TreeViewNodeContext.svelte` |
| `TreeViewNodeProvider` | `TreeViewNodeProvider.svelte` |
| `TreeView` | `TreeView.svelte` |
| `TreeViewBranch` | `TreeViewBranch.svelte` |
| `TreeViewBranchContent` | `TreeViewBranchContent.svelte` |
| `TreeViewBranchControl` | `TreeViewBranchControl.svelte` |
| `TreeViewBranchIndentGuide` | `TreeViewBranchIndentGuide.svelte` |
| `TreeViewBranchIndicator` | `TreeViewBranchIndicator.svelte` |
| `TreeViewBranchText` | `TreeViewBranchText.svelte` |
| `TreeViewBranchTrigger` | `TreeViewBranchTrigger.svelte` |
| `TreeViewItem` | `TreeViewItem.svelte` |
| `TreeViewItemIndicator` | `TreeViewItemIndicator.svelte` |
| `TreeViewItemText` | `TreeViewItemText.svelte` |
| `TreeViewLabel` | `TreeViewLabel.svelte` |
| `TreeViewNode` | `TreeViewNode.svelte` |
| `TreeViewNodeCheckbox` | `TreeViewNodeCheckbox.svelte` |
| `TreeViewNodeCheckboxIndicator` | `TreeViewNodeCheckboxIndicator.svelte` |
| `TreeViewNodeRenameInput` | `TreeViewNodeRenameInput.svelte` |
| `TreeViewRootProvider` | `TreeViewRootProvider.svelte` |
| `TreeViewTree` | `TreeViewTree.svelte` |

`TreeViewContext`, `TreeViewNodeContext`, `TreeViewNodeProvider`, `TreeViewNode` render no element of their own: they create the state and provide it to the other parts.

## Props

### `TreeViewContext` — `TreeViewContextProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `render` | `Snippet<[TreeViewApi]>` | — |  |

### `TreeViewNodeContext` — `TreeViewNodeContextProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `render` | `Snippet<[() => TreeViewNodeState]>` | — |  |

### `TreeViewNodeProvider` — `TreeViewNodeProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `node` | `TreeNode` | — |  |
| `indexPath` | `number[]` | — |  |
| `children` | `Snippet` | — |  |

### `TreeViewBranchIndicator` — `TreeViewBranchIndicatorProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet` | — |  |

### `TreeViewBranchTrigger` — `TreeViewBranchTriggerProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet` | — |  |

### `TreeViewItemIndicator` — `TreeViewItemIndicatorProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet` | — |  |

### `TreeViewNode` — `TreeViewNodeProps`
adds to `Omit<TreeViewNodeProviderProps, 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `node` | `TreeNode` | — | from `TreeViewNodeProviderProps` |
| `indexPath` | `number[]` | — | from `TreeViewNodeProviderProps` |
| `children` | `Snippet` | — | from `TreeViewNodeProviderProps` |

### `TreeViewNodeCheckboxIndicator` — `TreeViewNodeCheckboxIndicatorProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `indeterminate` | `Snippet` | — |  |
| `fallback` | `Snippet` | — |  |

### `TreeViewRootProvider` — `TreeViewRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `TreeViewApi<T>` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `TreeView` | `tree-view` | `root` | `tree-view-root` |
| `TreeViewBranch` | `tree-view` | `branch` | `tree-view-branch` |
| `TreeViewBranchContent` | `tree-view` | `branch-content` | `tree-view-branch-content` |
| `TreeViewBranchControl` | `tree-view` | `branch-control` | `tree-view-branch-control` |
| `TreeViewBranchIndentGuide` | `tree-view` | `branch-indent-guide` | `tree-view-branch-indent-guide` |
| `TreeViewBranchIndicator` | `tree-view` | `branch-indicator` | `tree-view-branch-indicator` |
| `TreeViewBranchText` | `tree-view` | `branch-text` | `tree-view-branch-text` |
| `TreeViewBranchTrigger` | `tree-view` | `branch-trigger` | `tree-view-branch-trigger` |
| `TreeViewItem` | `tree-view` | `item` | `tree-view-item` |
| `TreeViewItemIndicator` | `tree-view` | `item-indicator` | `tree-view-item-indicator` |
| `TreeViewItemText` | `tree-view` | `item-text` | `tree-view-item-text` |
| `TreeViewLabel` | `tree-view` | `label` | `tree-view-label` |
| `TreeViewNodeCheckbox` | `tree-view` | `node-checkbox` | `tree-view-node-checkbox` |
| `TreeViewNodeCheckboxIndicator` | `tree-view` | `node-checkbox-indicator` | `tree-view-node-checkbox-indicator` |
| `TreeViewNodeRenameInput` | `tree-view` | `node-rename-input` | `tree-view-node-rename-input` |
| `TreeViewRootProvider` | `tree-view` | `root` | `tree-view-root-provider` |
| `TreeViewTree` | `tree-view` | `tree` | `tree-view-tree` |

Custom properties read by this family’s CSS Module:

- `--moduix-tree-view-indent`
- `--moduix-tree-view-width`

## Generated ids

- `tree:${id}:label`
- `tree:${id}:node:${id}`
- `tree:${id}:rename-input:${id}`
- `tree:${id}:root`
- `tree:${id}:tree`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
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
	} from 'rta-ui';

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
```

## Behaviour covered by tests

- renders the Ark contract: ids, roles and data hooks
- :
- :
- :
- expands and collapses a branch from the pointer and reports details
- keyboard navigation follows the ARIA tree pattern
- typeahead focuses the next visible node that matches
- selects in single and multiple mode, including modifier clicks
- checkbox tree reports checked and indeterminate state
- loads children asynchronously through loadChildren
- renames a node from the rename input
- drives the tree from an api created outside the parts

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
