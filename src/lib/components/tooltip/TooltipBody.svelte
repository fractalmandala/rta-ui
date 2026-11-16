<script module lang="ts">
	import type { TooltipContentProps } from './TooltipContent.svelte';

	export interface TooltipBodyProps extends TooltipContentProps {}
</script>

<script lang="ts">
	import TooltipContent from './TooltipContent.svelte';
	import TooltipPositioner from './TooltipPositioner.svelte';

	let { ...props }: TooltipBodyProps = $props();
</script>

<TooltipPositioner>
	<TooltipContent {...props} />
</TooltipPositioner>
