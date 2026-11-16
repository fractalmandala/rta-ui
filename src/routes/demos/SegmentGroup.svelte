<script lang="ts">
	import { SegmentGroup, SegmentGroupIndicator, SegmentGroupItems } from '../../lib/index';

	const frameworks = ['React', 'Solid', 'Svelte', 'Vue'];
</script>

<SegmentGroup aria-label="Framework" defaultValue="Svelte">
	<SegmentGroupIndicator />
	<SegmentGroupItems items={frameworks} />
</SegmentGroup>
