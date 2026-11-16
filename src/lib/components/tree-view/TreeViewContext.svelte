<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TreeViewApi } from './tree-view.state.svelte';

	export interface TreeViewContextProps {
		render: Snippet<[TreeViewApi]>;
	}
</script>

<script lang="ts">
	import { useTreeViewContext } from './tree-view.state.svelte';

	const { render }: TreeViewContextProps = $props();

	const api = useTreeViewContext();
</script>

{@render render(api)}
