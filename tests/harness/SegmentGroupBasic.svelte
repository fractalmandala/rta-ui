<script lang="ts">
	import {
		SegmentGroup,
		SegmentGroupIndicator,
		SegmentGroupItems,
		SegmentGroupLabel
	} from '../../src/lib/index';

	let {
		disabled = undefined,
		onValueChange = undefined,
		value = $bindable(undefined)
	}: {
		disabled?: boolean;
		onValueChange?: (details: { value: string | null }) => void;
		value?: string | null;
	} = $props();
</script>

<SegmentGroup {disabled} {onValueChange} bind:value>
	<SegmentGroupLabel>Sizes</SegmentGroupLabel>
	<SegmentGroupItems items={['sm', 'md', { value: 'lg', label: 'lg', disabled: true }]} />
	<SegmentGroupIndicator />
</SegmentGroup>
