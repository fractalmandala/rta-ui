<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TourApi, UseTourProps } from './tour.state.svelte';

	export interface TourRootProps extends UseTourProps {
		tour?: TourApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { createTour, setTourContext } from './tour.state.svelte';

	let { children, tour, ...props }: TourRootProps = $props();

	const uid = $props.id();
	const api = untrack(() => tour) ?? createTour(() => props, uid);
	setTourContext(untrack(() => api));
</script>

{@render children?.()}
