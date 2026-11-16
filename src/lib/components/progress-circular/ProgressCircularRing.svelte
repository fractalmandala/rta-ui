<script module lang="ts">
	import type { ProgressCircularCircleProps } from './ProgressCircularCircle.svelte';
	import ProgressCircularCircle from './ProgressCircularCircle.svelte';
	import ProgressCircularCircleRange from './ProgressCircularCircleRange.svelte';
	import ProgressCircularCircleTrack from './ProgressCircularCircleTrack.svelte';

	export interface ProgressCircularRingProps
		extends Omit<ProgressCircularCircleProps, 'asChild' | 'children'> {}
</script>

<script lang="ts">
	let { ref = $bindable(null), ...props }: ProgressCircularRingProps = $props();
</script>

<ProgressCircularCircle {...props} bind:ref>
	<ProgressCircularCircleTrack />
	<ProgressCircularCircleRange />
</ProgressCircularCircle>
