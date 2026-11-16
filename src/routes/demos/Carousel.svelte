<script lang="ts">
	import {
		Carousel,
		CarouselAutoplayIndicator,
		CarouselAutoplayTrigger,
		CarouselControl,
		CarouselIndicators,
		CarouselItem,
		CarouselItemGroup,
		CarouselNextTrigger,
		CarouselPrevTrigger,
		CarouselProgressText,
		CarouselSpinner
	} from '../../lib/components/carousel/index';

	const slides = [
		{ title: 'Composable parts', body: 'Root, track, items and controls.' },
		{ title: 'Keyboard and swipe', body: 'Arrow keys, indicators and pointer drag.' },
		{ title: 'Autoplay', body: 'Delay, countdown and pause on hover.' }
	];
</script>

<Carousel slideCount={slides.length} spacing="0.75rem" autoplay={{ delay: 5000 }} pauseOnHover>
	<CarouselItemGroup aria-label="Feature slides" style="height: 9rem">
		{#each slides as slide, index (slide.title)}
			<CarouselItem {index}>
				<div
					style="height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 0.25rem; padding: 1.25rem; border: 1px solid var(--moduix-border); border-radius: var(--moduix-radius-xl)"
				>
					<strong>{slide.title}</strong>
					<span>{slide.body}</span>
				</div>
			</CarouselItem>
		{/each}
	</CarouselItemGroup>
	<CarouselControl>
		<CarouselPrevTrigger />
		<CarouselAutoplayTrigger>
			<CarouselAutoplayIndicator>
				Pause
				{#snippet fallback()}Play{/snippet}
			</CarouselAutoplayIndicator>
		</CarouselAutoplayTrigger>
		<CarouselSpinner />
		<CarouselIndicators />
		<CarouselProgressText />
		<CarouselNextTrigger />
	</CarouselControl>
</Carousel>
