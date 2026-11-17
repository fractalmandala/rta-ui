---
title: AngleSlider
component: angle-slider
description: Pick an angle from 0 to 360 degrees on a circular dial.
---

# AngleSlider

Pick an angle from 0 to 360 degrees on a circular dial.

Port of `moduix/packages/svelte/src/components/angle-slider` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { AngleSlider } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `AngleSlider` | `AngleSlider.svelte` | `—` |
| `AngleSliderControl` | `AngleSliderControl.svelte` | `presentation` |
| `AngleSliderDial` | `AngleSliderDial.svelte` | `—` |
| `AngleSliderHiddenInput` | `AngleSliderHiddenInput.svelte` | `—` |
| `AngleSliderLabel` | `AngleSliderLabel.svelte` | `—` |
| `AngleSliderMarker` | `AngleSliderMarker.svelte` | `—` |
| `AngleSliderMarkerGroup` | `AngleSliderMarkerGroup.svelte` | `—` |
| `AngleSliderMarks` | `AngleSliderMarks.svelte` | `—` |
| `AngleSliderRootProvider` | `AngleSliderRootProvider.svelte` | `—` |
| `AngleSliderThumb` | `AngleSliderThumb.svelte` | `slider` |
| `AngleSliderValueText` | `AngleSliderValueText.svelte` | `—` |

ARIA roles rendered by this family: `presentation`, `slider`.

## Props

### `AngleSlider` — `AngleSliderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'aria-label' | 'aria-labelledby'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `Omit<UseAngleSliderProps, 'aria-label' | 'aria-labelledby'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | from `UseAngleSliderProps` |
| `aria-labelledby` | `string` | — | from `UseAngleSliderProps` |
| `value` | `number` | — | bindable from `UseAngleSliderProps` |
| `defaultValue` | `number` | — | from `UseAngleSliderProps` |
| `step` | `number` | — | from `UseAngleSliderProps` |
| `disabled` | `boolean` | — | from `UseAngleSliderProps` |
| `readOnly` | `boolean` | — | from `UseAngleSliderProps` |
| `invalid` | `boolean` | — | from `UseAngleSliderProps` |
| `name` | `string` | — | from `UseAngleSliderProps` |
| `id` | `string \| null` | — | from `UseAngleSliderProps` |
| `ids` | `AngleSliderIds` | — | from `UseAngleSliderProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseAngleSliderProps` |
| `onValueChange` | `(details: AngleSliderValueChangeDetails) => void` | — | from `UseAngleSliderProps` |
| `onValueChangeEnd` | `(details: AngleSliderValueChangeEndDetails) => void` | — | from `UseAngleSliderProps` |
| `'aria-label'` | `string` | — |  |
| `'aria-labelledby'` | `string` | — |  |

### `AngleSliderControl` — `AngleSliderControlProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — |  |

### `AngleSliderDial` — `AngleSliderDialProps`
adds to `Omit<AngleSliderControlProps, 'asChild'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — | from `AngleSliderControlProps` |

### `AngleSliderLabel` — `AngleSliderLabelProps`
accepts the native props of `HTMLProps<'label'>`, `PolymorphicProps<'label'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — |  |

### `AngleSliderMarker` — `AngleSliderMarkerProps`
accepts the native props of `Omit<HTMLProps<'span'>, 'children'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `number` | — |  |

### `AngleSliderMarkerGroup` — `AngleSliderMarkerGroupProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — |  |

### `AngleSliderMarks` — `AngleSliderMarksProps`
adds to `Omit<AngleSliderMarkerGroupProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — | from `AngleSliderMarkerGroupProps` |
| `values` | `readonly number[]` | — |  |

### `AngleSliderRootProvider` — `AngleSliderRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `AngleSliderApi` | — |  |
| `children` | `import('svelte').Snippet` | — |  |

### `AngleSliderThumb` — `AngleSliderThumbProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — |  |

### `AngleSliderValueText` — `AngleSliderValueTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `import('svelte').Snippet` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `AngleSlider` | `angle-slider` | `root` | `angle-slider-root` |
| `AngleSliderControl` | `angle-slider` | `control` | `angle-slider-control` |
| `AngleSliderHiddenInput` | `angle-slider` | `hidden-input` | `angle-slider-hidden-input` |
| `AngleSliderLabel` | `angle-slider` | `label` | `angle-slider-label` |
| `AngleSliderMarker` | `angle-slider` | `marker` | `angle-slider-marker` |
| `AngleSliderMarkerGroup` | `angle-slider` | `marker-group` | `angle-slider-marker-group` |
| `AngleSliderRootProvider` | `angle-slider` | `root` | `angle-slider-root-provider` |
| `AngleSliderThumb` | `angle-slider` | `thumb` | `angle-slider-thumb` |
| `AngleSliderValueText` | `angle-slider` | `value-text` | `angle-slider-value-text` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-angle-slider-indicator-bg` | `var(--moduix-primary)` |
| `--moduix-angle-slider-ring-thickness` | `var(--moduix-spacing-2)` |
| `--moduix-angle-slider-size` | `9rem` |
| `--moduix-angle-slider-thumb-size` | `var(--moduix-spacing-4)` |
| `--moduix-angle-slider-track-bg` | `var(--moduix-muted)` |

## Keyboard

Keys handled by this family: `End`, `Home`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `angle-slider:${id}`
- `angle-slider:${id}:control`
- `angle-slider:${id}:input`
- `angle-slider:${id}:label`
- `angle-slider:${id}:thumb`
- `angle-slider:${id}:value-text`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		AngleSlider,
		AngleSliderControl,
		AngleSliderLabel,
		AngleSliderMarks,
		AngleSliderThumb,
		AngleSliderValueText
	} from 'rta-ui';
</script>

<AngleSlider defaultValue={135} step={5}>
	<AngleSliderLabel>Rotation</AngleSliderLabel>
	<AngleSliderControl>
		<AngleSliderValueText />
		<AngleSliderThumb />
		<AngleSliderMarks values={[0, 90, 180, 270]} />
	</AngleSliderControl>
</AngleSlider>
```

## Behaviour covered by tests

- renders every part with the moduix hooks
- the dial composition nests the value text and thumb in the control
- marks report their state relative to the value
- arrow, home and end keys step the value
- pressing the control sets the value from the pointer angle
- the value is clamped to the 0-359 degree range
- a read-only slider keeps its value
- a disabled slider is not reachable by keyboard

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable.
  Extra slots: `angle-slider-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
