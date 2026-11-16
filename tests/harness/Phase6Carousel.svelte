<script lang="ts">
	import {
		Carousel,
		CarouselAutoplayIndicator,
		CarouselAutoplayTrigger,
		CarouselContext,
		CarouselControl,
		CarouselIndicator,
		CarouselIndicatorGroup,
		CarouselIndicators,
		CarouselItem,
		CarouselItemGroup,
		CarouselNextTrigger,
		CarouselPrevTrigger,
		CarouselProgressText,
		CarouselSpinner
	} from '../../src/lib/components/carousel/index';
	import type {
		CarouselAutoplay,
		CarouselAutoplayStatusDetails,
		CarouselDragStatusDetails,
		CarouselOrientation,
		CarouselPageChangeDetails,
		CarouselSnapType
	} from '../../src/lib/components/carousel/index';

	let {
		slideCount = 4,
		spacing = '0px',
		slidesPerPage = 1,
		slidesPerMove = 'auto',
		snapType = 'mandatory',
		loop = false,
		dir = undefined as 'ltr' | 'rtl' | 'auto' | null | undefined,
		orientation = 'horizontal',
		autoplay = false,
		autoSize = false,
		pauseOnHover = false,
		allowMouseDrag = true,
		threshold = 40,
		page = $bindable(undefined as number | undefined),
		indicators = 'auto',
		readOnlyIndicator = false,
		translations,
		onPageChange,
		onDragStatusChange,
		onAutoplayStatusChange
	}: {
		slideCount?: number;
		spacing?: string;
		slidesPerPage?: number;
		slidesPerMove?: number | 'auto';
		snapType?: CarouselSnapType;
		loop?: boolean;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		orientation?: CarouselOrientation;
		autoplay?: CarouselAutoplay;
		autoSize?: boolean;
		pauseOnHover?: boolean;
		allowMouseDrag?: boolean;
		threshold?: number;
		page?: number | undefined;
		indicators?: 'auto' | 'custom' | 'none';
		readOnlyIndicator?: boolean;
		translations?: { nextTrigger?: string; prevTrigger?: string };
		onPageChange?: (details: CarouselPageChangeDetails) => void;
		onDragStatusChange?: (details: CarouselDragStatusDetails) => void;
		onAutoplayStatusChange?: (details: CarouselAutoplayStatusDetails) => void;
	} = $props();

</script>

{#snippet parts()}
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
		{#if indicators === 'auto'}
			<CarouselIndicators indicatorClassName="dot" />
		{:else if indicators === 'custom'}
			<CarouselIndicatorGroup aria-label="Pages">
				{#each Array.from({ length: slideCount }) as _page, index (index)}
					<CarouselIndicator {index} readOnly={readOnlyIndicator && index > 0}>
						{index + 1}
					</CarouselIndicator>
				{/each}
			</CarouselIndicatorGroup>
		{/if}
		<CarouselProgressText />
		<CarouselSpinner />
		<CarouselNextTrigger />
	</CarouselControl>
	<CarouselAutoplayIndicator />
	<CarouselContext>
		{#snippet render(getApi)}
			<output data-testid="page">{getApi().page}</output>
			<output data-testid="pages">{getApi().pages.join(',')}</output>
			<output data-testid="playing">{getApi().isPlaying}</output>
			<output data-testid="dragging">{getApi().isDragging}</output>
			<output data-testid="remaining">{getApi().autoplayRemaining}</output>
			<button type="button" data-testid="refresh" onclick={() => getApi().refresh()}>
				Refresh
			</button>
			<button type="button" data-testid="last" onclick={() => getApi().scrollToIndex(slideCount - 1)}>
				Last slide
			</button>
			<button type="button" data-testid="play" onclick={() => getApi().play()}>Play</button>
			<button type="button" data-testid="pause" onclick={() => getApi().pause()}>Pause</button>
		{/snippet}
	</CarouselContext>
{/snippet}

<Carousel
	{slideCount}
	{spacing}
	{slidesPerPage}
	{slidesPerMove}
	{snapType}
	{loop}
	{dir}
	{orientation}
	{autoplay}
	{autoSize}
	{pauseOnHover}
	{allowMouseDrag}
	{threshold}
	{translations}
	bind:page
	{onPageChange}
	{onDragStatusChange}
	{onAutoplayStatusChange}
	aria-label="Carousel"
>
	{@render parts()}
</Carousel>
