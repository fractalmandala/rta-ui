<script module lang="ts">
	import type { PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CarouselIndicatorGroupProps } from './CarouselIndicatorGroup.svelte';

	export interface CarouselIndicatorsProps
		extends Omit<CarouselIndicatorGroupProps, 'asChild' | 'children'>, PolymorphicProps<'div'>, RefAttribute {
		indicatorClassName?: string;
	}
</script>

<script lang="ts">
	import CarouselIndicator from './CarouselIndicator.svelte';
	import CarouselIndicatorGroup from './CarouselIndicatorGroup.svelte';
	import { useCarouselContext } from './carousel.state.svelte';

	let {
		indicatorClassName,
		ref = $bindable(null),
		...props
	}: CarouselIndicatorsProps = $props();

	const api = useCarouselContext();
</script>

<CarouselIndicatorGroup {...props} bind:ref>
	{#each api.pages as _start, index (index)}
		<CarouselIndicator {index} class={indicatorClassName} />
	{/each}
</CarouselIndicatorGroup>
