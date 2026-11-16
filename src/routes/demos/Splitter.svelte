<script lang="ts">
	import { Splitter, SplitterPanel, SplitterResizeTrigger } from '../../lib/index';

	const panels = [
		{ id: 'a', minSize: 20 },
		{ id: 'b', minSize: 20 }
	];
</script>

<div style="height: 12rem">
	<Splitter {panels} defaultSize={[40, 60]}>
		<SplitterPanel id="a">A</SplitterPanel>
		<SplitterResizeTrigger id="a:b" aria-label="Resize panels" />
		<SplitterPanel id="b">B</SplitterPanel>
	</Splitter>
</div>
