<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TourStepAction } from './tour.state.svelte';

	export interface TourActionsProps {
		children: Snippet<[() => TourStepAction[]]>;
	}
</script>

<script lang="ts">
	import { useTourContext } from './tour.state.svelte';

	let { children }: TourActionsProps = $props();

	const api = useTourContext();
	const actions = $derived(api.step?.actions ?? []);
</script>

{@render children(() => actions)}
