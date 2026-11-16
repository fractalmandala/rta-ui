<script lang="ts">
	import {
		CarouselAutoplayIndicator,
		CarouselAutoplayTrigger,
		CarouselContext,
		CarouselControl,
		CarouselIndicator,
		CarouselIndicatorGroup,
		CarouselItem,
		CarouselItemGroup,
		CarouselNextTrigger,
		CarouselPrevTrigger,
		CarouselProgressText,
		CarouselRootProvider,
		CarouselSpinner,
		createCarousel
	} from '../../src/lib/components/carousel/index';
	import type { CarouselPageChangeDetails } from '../../src/lib/components/carousel/index';

	let {
		slideCount = 3,
		page = $bindable(undefined as number | undefined),
		onPageChange
	}: {
		slideCount?: number;
		page?: number | undefined;
		onPageChange?: (details: CarouselPageChangeDetails) => void;
	} = $props();

	const uid = $props.id();

	const store = createCarousel(
		() => ({
			slideCount,
			page,
			onPageChange(details) {
				onPageChange?.(details);
				page = details.page;
			}
		}),
		`store-${uid}`
	);
</script>

<CarouselRootProvider value={store} aria-label="Carousel">
	<CarouselItemGroup aria-label="Slides">
		{#each Array.from({ length: slideCount }) as _slide, index (index)}
			<CarouselItem {index}>
				<div data-testid="slide">Slide {index + 1}</div>
			</CarouselItem>
		{/each}
	</CarouselItemGroup>
	<CarouselControl>
		<CarouselPrevTrigger />
		<CarouselAutoplayTrigger>Rotate</CarouselAutoplayTrigger>
		<CarouselIndicatorGroup aria-label="Pages">
			{#each Array.from({ length: slideCount }) as _page, index (index)}
				<CarouselIndicator {index}>{index + 1}</CarouselIndicator>
			{/each}
		</CarouselIndicatorGroup>
		<CarouselProgressText />
		<CarouselSpinner />
		<CarouselNextTrigger />
	</CarouselControl>
	<CarouselAutoplayIndicator />
	<CarouselContext>
		{#snippet render(getApi)}
			<output data-testid="page">{getApi().page}</output>
		{/snippet}
	</CarouselContext>
</CarouselRootProvider>
