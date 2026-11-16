<script lang="ts">
	import {
		ScrollAreaContent,
		ScrollAreaCorner,
		ScrollAreaRootProvider,
		ScrollAreaScrollbar,
		ScrollAreaThumb,
		ScrollAreaViewport,
		createScrollArea
	} from '../../src/lib/index';

	let progress = $state('');
	let edges = $state('');

	const api = createScrollArea(() => ({ id: 'harness', dir: 'ltr' }), 'harness');
</script>

<ScrollAreaRootProvider value={api}>
	<ScrollAreaViewport data-testid="viewport" style="height: 200px">
		<ScrollAreaContent>
			<div style="height: 900px">Content</div>
		</ScrollAreaContent>
	</ScrollAreaViewport>
	<ScrollAreaScrollbar orientation="vertical" data-testid="scrollbar-y">
		<ScrollAreaThumb orientation="vertical" data-testid="thumb-y" />
	</ScrollAreaScrollbar>
	<ScrollAreaScrollbar orientation="horizontal" data-testid="scrollbar-x">
		<ScrollAreaThumb orientation="horizontal" data-testid="thumb-x" />
	</ScrollAreaScrollbar>
	<ScrollAreaCorner />
</ScrollAreaRootProvider>

<button data-testid="measure" onclick={() => api.measure()}>measure</button>
<button
	data-testid="progress"
	onclick={() => {
		progress = JSON.stringify(api.getScrollProgress());
		edges = `${api.isAtTop}/${api.isAtBottom}/${api.hasOverflowY}`;
	}}>progress</button
>
<button data-testid="bottom" onclick={() => api.scrollToEdge({ edge: 'bottom', behavior: 'auto' })}>bottom</button>
<span data-part="progress">{progress}</span>
<span data-part="edges">{edges}</span>
