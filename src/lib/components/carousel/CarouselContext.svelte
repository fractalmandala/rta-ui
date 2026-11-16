<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { CarouselApi } from './carousel.state.svelte';

	export interface CarouselContextProps {
		render: Snippet<[() => CarouselApi]>;
	}
</script>

<script lang="ts">
	import { useCarouselContext } from './carousel.state.svelte';

	let { render }: CarouselContextProps = $props();

	const api = useCarouselContext();
	const getApi = () => api;
</script>

{@render render(getApi)}
