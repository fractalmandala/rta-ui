<script lang="ts">
	import {
		createJsonTreeView,
		JsonTreeViewRootProvider,
		JsonTreeViewTree
	} from '../../src/lib/components/json-tree-view/index';

	const data = {
		alpha: { one: 1, two: 2 },
		beta: [true, null]
	};

	const uid = $props.id();
	const api = createJsonTreeView(() => ({ data, defaultExpandedDepth: 1 }), uid);
</script>

<JsonTreeViewRootProvider value={api}>
	<JsonTreeViewTree />
	<button data-testid="expand-all" onclick={() => api.expand()}>Expand all</button>
</JsonTreeViewRootProvider>
