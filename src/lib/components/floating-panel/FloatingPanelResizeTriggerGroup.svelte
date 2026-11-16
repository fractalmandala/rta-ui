<script module lang="ts">
	import type { FloatingPanelResizeTriggerAxis } from './floating-panel.state.svelte';

	export interface FloatingPanelResizeTriggerGroupProps {
		axes?: readonly FloatingPanelResizeTriggerAxis[];
	}
</script>

<script lang="ts">
	import FloatingPanelResizeTrigger from './FloatingPanelResizeTrigger.svelte';
	import { resizeTriggerAxes } from './floating-panel.types';

	let { axes = resizeTriggerAxes }: FloatingPanelResizeTriggerGroupProps = $props();
</script>

{#each axes as axis (axis)}
	<FloatingPanelResizeTrigger {axis} />
{/each}
