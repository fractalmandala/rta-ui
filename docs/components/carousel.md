---
title: Carousel
component: carousel
description: Page through slides with buttons, indicators, swipe, or autoplay.
---

# Carousel

Page through slides with buttons, indicators, swipe, or autoplay.

Port of `moduix/packages/svelte/src/components/carousel` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Carousel } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Carousel` | `Carousel.svelte` | `region` |
| `CarouselAutoplayIndicator` | `CarouselAutoplayIndicator.svelte` | `—` |
| `CarouselAutoplayTrigger` | `CarouselAutoplayTrigger.svelte` | `—` |
| `CarouselContext` | `CarouselContext.svelte` | `—` |
| `CarouselControl` | `CarouselControl.svelte` | `—` |
| `CarouselIndicator` | `CarouselIndicator.svelte` | `—` |
| `CarouselIndicatorGroup` | `CarouselIndicatorGroup.svelte` | `—` |
| `CarouselIndicators` | `CarouselIndicators.svelte` | `—` |
| `CarouselItem` | `CarouselItem.svelte` | `group` |
| `CarouselItemGroup` | `CarouselItemGroup.svelte` | `—` |
| `CarouselNextTrigger` | `CarouselNextTrigger.svelte` | `—` |
| `CarouselPrevTrigger` | `CarouselPrevTrigger.svelte` | `—` |
| `CarouselProgressText` | `CarouselProgressText.svelte` | `—` |
| `CarouselRootProvider` | `CarouselRootProvider.svelte` | `—` |
| `CarouselSpinner` | `CarouselSpinner.svelte` | `none (aria-hidden)` |

`CarouselContext` renders no element of its own: it creates the state and provides it to the other parts.

ARIA roles rendered by this family: `group`, `region`.

## Props

### `Carousel` — `CarouselRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseCarouselProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `slideCount` | `number` | — | from `UseCarouselProps` |
| `page` | `number` | — | bindable from `UseCarouselProps` |
| `defaultPage` | `number` | — | from `UseCarouselProps` |
| `onPageChange` | `(details: CarouselPageChangeDetails) => void` | — | from `UseCarouselProps` |
| `orientation` | `CarouselOrientation` | — | from `UseCarouselProps` |
| `snapType` | `CarouselSnapType` | — | from `UseCarouselProps` |
| `loop` | `boolean` | — | from `UseCarouselProps` |
| `slidesPerPage` | `number` | — | from `UseCarouselProps` |
| `slidesPerMove` | `number \| 'auto'` | — | from `UseCarouselProps` |
| `spacing` | `string` | — | from `UseCarouselProps` |
| `padding` | `string` | — | from `UseCarouselProps` |
| `autoplay` | `CarouselAutoplay` | — | from `UseCarouselProps` |
| `allowMouseDrag` | `boolean` | — | from `UseCarouselProps` |
| `autoSize` | `boolean` | — | from `UseCarouselProps` |
| `inViewThreshold` | `number \| number[]` | — | from `UseCarouselProps` |
| `threshold` | `number` | — | Pixels a pointer gesture must travel before it commits to another page. from `UseCarouselProps` |
| `pauseOnHover` | `boolean` | — | Pauses autoplay while the pointer is over the carousel and resumes on leave. from `UseCarouselProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseCarouselProps` |
| `id` | `string \| null` | — | from `UseCarouselProps` |
| `ids` | `CarouselElementIds` | — | from `UseCarouselProps` |
| `getRootNode` | `() => ShadowRoot \| Document \| Node` | — | from `UseCarouselProps` |
| `translations` | `CarouselTranslations` | — | from `UseCarouselProps` |
| `onDragStatusChange` | `(details: CarouselDragStatusDetails) => void` | — | from `UseCarouselProps` |
| `onAutoplayStatusChange` | `(details: CarouselAutoplayStatusDetails) => void` | — | from `UseCarouselProps` |

### `CarouselAutoplayIndicator` — `CarouselAutoplayIndicatorProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `fallback` | `Snippet` | — |  |

### `CarouselContext` — `CarouselContextProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `render` | `Snippet<[() => CarouselApi]>` | — |  |

### `CarouselIndicator` — `CarouselIndicatorProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |
| `readOnly` | `boolean` | `false` |  |

### `CarouselIndicators` — `CarouselIndicatorsProps`
accepts the native props of `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `Omit<CarouselIndicatorGroupProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `indicatorClassName` | `string` | — |  |

### `CarouselItem` — `CarouselItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |
| `snapAlign` | `CarouselSnapAlign` | — |  |

### `CarouselRootProvider` — `CarouselRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `CarouselApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Carousel` | `carousel` | `root` | `carousel-root` |
| `CarouselAutoplayIndicator` | `carousel` | `autoplay-indicator` | `carousel-autoplay-indicator` |
| `CarouselAutoplayTrigger` | `carousel` | `autoplay-trigger` | `carousel-autoplay-trigger` |
| `CarouselControl` | `carousel` | `control` | `carousel-control` |
| `CarouselIndicator` | `carousel` | `indicator` | `carousel-indicator` |
| `CarouselIndicatorGroup` | `carousel` | `indicator-group` | `carousel-indicator-group` |
| `CarouselItem` | `carousel` | `item` | `carousel-item` |
| `CarouselItemGroup` | `carousel` | `item-group` | `carousel-item-group` |
| `CarouselNextTrigger` | `carousel` | `next-trigger` | `carousel-next-trigger` |
| `CarouselPrevTrigger` | `carousel` | `prev-trigger` | `carousel-prev-trigger` |
| `CarouselProgressText` | `carousel` | `progress-text` | `carousel-progress-text` |
| `CarouselRootProvider` | `carousel` | `root` | `carousel-root-provider` |
| `CarouselSpinner` | `carousel` | `spinner` | `carousel-spinner` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-carousel-control-bg` | `var(--moduix-card)` |
| `--moduix-carousel-control-border-color` | `var(--moduix-border)` |
| `--moduix-carousel-control-color` | `var(--moduix-foreground)` |
| `--moduix-carousel-control-size` | `var(--moduix-size-md)` |
| `--moduix-carousel-gap` | `var(--moduix-spacing-3)` |
| `--moduix-carousel-height` | `24rem` |
| `--moduix-carousel-indicator-bg-current` | `var(--moduix-primary)` |
| `--moduix-carousel-indicator-size` | `var(--moduix-spacing-2)` |

## Keyboard

Keys handled by this family: `End`, `Home`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `carousel:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
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
	} from 'rta-ui';

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
```

## Behaviour covered by tests

- renders the Ark contract and the moduix hooks
- writes the sizing custom properties and the track transform
- moves between pages with triggers, arrow keys and loop
- indicators set the page, honour readOnly and respond to keys
- drags with document pointer listeners and a commit threshold
- translates the track by the measured slide size on both axes
- autoplays, counts down, pauses on hover and toggles from the trigger
- shares state through CarouselRootProvider

## Notes

- **Parity:** accepted deviation — Upstream renders the carousel spinner inside the control; here it is a public part so a loading state can be placed explicitly.
  Extra slots: `carousel-spinner`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
