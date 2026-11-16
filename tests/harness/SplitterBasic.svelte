<script lang="ts">
	import { Splitter, SplitterPanel, SplitterResizeTrigger } from '../../src/lib/index';

	let { orientation = undefined, size = undefined }: {
		orientation?: 'horizontal' | 'vertical';
		size?: Array<number | string>;
	} = $props();

	const panels = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
</script>

<Splitter {panels} orientation={orientation} {size} style="height: 300px">
	<SplitterPanel id="a">A</SplitterPanel>
	<SplitterResizeTrigger id="a:b" />
	<SplitterPanel id="b">B</SplitterPanel>
	<SplitterResizeTrigger id="b:c" />
	<SplitterPanel id="c">C</SplitterPanel>
</Splitter>

