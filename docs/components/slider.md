---
title: Slider
component: slider
description: Pick a value or a range by dragging along a track.
---

# Slider

Pick a value or a range by dragging along a track.

Port of `moduix/packages/svelte/src/components/slider` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Slider } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Slider` | `Slider.svelte` | `—` |
| `SliderControl` | `SliderControl.svelte` | `—` |
| `SliderDraggingIndicator` | `SliderDraggingIndicator.svelte` | `presentation` |
| `SliderHiddenInput` | `SliderHiddenInput.svelte` | `—` |
| `SliderLabel` | `SliderLabel.svelte` | `—` |
| `SliderMarker` | `SliderMarker.svelte` | `presentation` |
| `SliderMarkerGroup` | `SliderMarkerGroup.svelte` | `presentation` |
| `SliderRange` | `SliderRange.svelte` | `—` |
| `SliderRootProvider` | `SliderRootProvider.svelte` | `—` |
| `SliderThumb` | `SliderThumb.svelte` | `slider` |
| `SliderThumbs` | `SliderThumbs.svelte` | `—` |
| `SliderTrack` | `SliderTrack.svelte` | `—` |
| `SliderValueText` | `SliderValueText.svelte` | `—` |

ARIA roles rendered by this family: `presentation`, `slider`.

## Props

### `Slider` — `SliderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'aria-label' | 'aria-labelledby'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `Omit<UseSliderProps, 'aria-label' | 'aria-labelledby'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `aria-label` | `string \| string[]` | — | from `UseSliderProps` |
| `aria-labelledby` | `string \| string[]` | — | from `UseSliderProps` |
| `value` | `number[]` | — | bindable from `UseSliderProps` |
| `defaultValue` | `number[]` | — | from `UseSliderProps` |
| `min` | `number` | — | from `UseSliderProps` |
| `max` | `number` | — | from `UseSliderProps` |
| `step` | `number` | — | from `UseSliderProps` |
| `largeStep` | `number` | — | from `UseSliderProps` |
| `minStepsBetweenThumbs` | `number` | — | from `UseSliderProps` |
| `orientation` | `SliderOrientation` | — | from `UseSliderProps` |
| `origin` | `SliderOrigin` | — | from `UseSliderProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseSliderProps` |
| `disabled` | `boolean` | — | from `UseSliderProps` |
| `readOnly` | `boolean` | — | from `UseSliderProps` |
| `invalid` | `boolean` | — | from `UseSliderProps` |
| `name` | `string` | — | from `UseSliderProps` |
| `form` | `string` | — | from `UseSliderProps` |
| `id` | `string \| null` | — | from `UseSliderProps` |
| `ids` | `SliderIds` | — | from `UseSliderProps` |
| `thumbAlignment` | `SliderThumbAlignment` | — | from `UseSliderProps` |
| `thumbCollisionBehavior` | `SliderThumbCollisionBehavior` | — | from `UseSliderProps` |
| `thumbSize` | `SliderThumbSize` | — | from `UseSliderProps` |
| `getAriaValueText` | `(details: { value: number; index: number }) => string` | — | from `UseSliderProps` |
| `onValueChange` | `(details: SliderValueChangeDetails) => void` | — | from `UseSliderProps` |
| `onValueChangeEnd` | `(details: SliderValueChangeEndDetails) => void` | — | from `UseSliderProps` |
| `onFocusChange` | `(details: SliderFocusChangeDetails) => void` | — | from `UseSliderProps` |
| `'aria-label'` | `string \| string[]` | — |  |
| `'aria-labelledby'` | `string \| string[]` | — |  |

### `SliderDraggingIndicator` — `SliderDraggingIndicatorProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Index of the thumb the indicator follows. |

### `SliderHiddenInput` — `SliderHiddenInputProps`
accepts the native props of `HTMLProps<'input'>`, `PolymorphicProps<'input'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — | Index of the thumb whose value this input carries. |
| `name` | `string` | — | Overrides the input name derived from the root `name` prop. |

### `SliderMarker` — `SliderMarkerProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `number` | — | Value this marker represents on the track. |

### `SliderRootProvider` — `SliderRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `SliderApi` | — |  |

### `SliderThumb` — `SliderThumbProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Index of the thumb this element controls. |
| `name` | `string` | — | Name of the thumb, forwarded as `data-name`. |

### `SliderThumbs` — `SliderThumbsProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `class` | `SliderThumbProps['class']` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Slider` | `slider` | `root` | `slider-root` |
| `SliderControl` | `slider` | `control` | `slider-control` |
| `SliderDraggingIndicator` | `slider` | `dragging-indicator` | `slider-dragging-indicator` |
| `SliderHiddenInput` | `slider` | `hidden-input` | `slider-hidden-input` |
| `SliderLabel` | `slider` | `label` | `slider-label` |
| `SliderMarker` | `slider` | `marker` | `slider-marker` |
| `SliderMarkerGroup` | `slider` | `marker-group` | `slider-marker-group` |
| `SliderRange` | `slider` | `range` | `slider-range` |
| `SliderRootProvider` | `slider` | `root` | `slider-root-provider` |
| `SliderThumb` | `slider` | `thumb` | `slider-thumb` |
| `SliderTrack` | `slider` | `track` | `slider-track` |
| `SliderValueText` | `slider` | `value-text` | `slider-value-text` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-slider-range-bg` | `var(--moduix-primary)` |
| `--moduix-slider-thumb-size` | `var(--moduix-spacing-4)` |
| `--moduix-slider-track-bg` | `var(--moduix-muted)` |
| `--moduix-slider-track-size` | `var(--moduix-spacing-1-5)` |

## Keyboard

Keys handled by this family: `End`, `Home`, `PageDown`, `PageUp`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `slider:${id}`
- `slider:${id}:control`
- `slider:${id}:input:${id}`
- `slider:${id}:label`
- `slider:${id}:marker:${id}`
- `slider:${id}:range`
- `slider:${id}:thumb:${id}`
- `slider:${id}:track`
- `slider:${id}:value-text`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Slider,
		SliderControl,
		SliderLabel,
		SliderMarker,
		SliderMarkerGroup,
		SliderRange,
		SliderThumbs,
		SliderTrack,
		SliderValueText
	} from 'rta-ui';
</script>

<Slider defaultValue={[25, 75]} thumbCollisionBehavior="swap">
	<SliderLabel>Price range</SliderLabel>
	<SliderValueText />
	<SliderControl>
		<SliderTrack>
			<SliderRange />
		</SliderTrack>
		<SliderThumbs />
	</SliderControl>
	<SliderMarkerGroup>
		<SliderMarker value={0} />
		<SliderMarker value={50} />
		<SliderMarker value={100} />
	</SliderMarkerGroup>
</Slider>
```

## Behaviour covered by tests

- renders every part with the moduix hooks
- places thumbs and the range through the root custom properties
- formats the thumb value through getAriaValueText
- renders a marker group with per-marker state
- exposes one hidden input per thumb
- arrow, page, home and end keys step the focused thumb
- dragging the control moves the closest thumb
- vertical orientation maps the pointer position to the height
- two thumbs stay ordered with the none collision behaviour
- the swap collision behaviour exchanges the crossed thumbs
- a disabled slider ignores pointer and keyboard input

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable.
  Extra slots: `slider-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
