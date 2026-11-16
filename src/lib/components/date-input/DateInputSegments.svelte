<script module lang="ts">
	import type { DateInputSegmentGroupProps } from './DateInputSegmentGroup.svelte';

	export type DateInputSegmentsProps = Omit<DateInputSegmentGroupProps, 'asChild' | 'children'>;
</script>

<script lang="ts">
	import DateInputSegment from './DateInputSegment.svelte';
	import DateInputSegmentGroup from './DateInputSegmentGroup.svelte';
	import { useDateInputContext } from './date-input.state.svelte';

	let { ref = $bindable(null), index = 0, ...props }: DateInputSegmentsProps = $props();

	const api = useDateInputContext();
	const segments = $derived(api.getSegments({ index }));
</script>

<DateInputSegmentGroup {...props} bind:ref {index}>
	{#each segments as segment, position (position)}
		<DateInputSegment {segment} {position} />
	{/each}
</DateInputSegmentGroup>
