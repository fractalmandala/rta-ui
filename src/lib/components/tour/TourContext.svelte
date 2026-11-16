<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TourApi } from './tour.state.svelte';

	export interface TourContextProps {
		render: Snippet<[TourApi]>;
	}
</script>

<script lang="ts">
	import { useTourContext } from './tour.state.svelte';

	let { render }: TourContextProps = $props();

	const tour = useTourContext();
</script>

{@render render(tour)}
