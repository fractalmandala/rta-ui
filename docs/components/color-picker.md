---
title: ColorPicker
component: color-picker
description: Choose a color with an area, channel sliders, inputs, and swatches.
---

# ColorPicker

Choose a color with an area, channel sliders, inputs, and swatches.

Port of `moduix/packages/svelte/src/components/color-picker` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { ColorPicker } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `ColorPicker` | `ColorPicker.svelte` | `—` |
| `ColorPickerArea` | `ColorPickerArea.svelte` | `group` |
| `ColorPickerAreaBackground` | `ColorPickerAreaBackground.svelte` | `—` |
| `ColorPickerAreaThumb` | `ColorPickerAreaThumb.svelte` | `slider` |
| `ColorPickerChannelInput` | `ColorPickerChannelInput.svelte` | `—` |
| `ColorPickerChannelSlider` | `ColorPickerChannelSlider.svelte` | `presentation` |
| `ColorPickerChannelSliderLabel` | `ColorPickerChannelSliderLabel.svelte` | `—` |
| `ColorPickerChannelSliderThumb` | `ColorPickerChannelSliderThumb.svelte` | `slider` |
| `ColorPickerChannelSliderTrack` | `ColorPickerChannelSliderTrack.svelte` | `group` |
| `ColorPickerChannelSliderValueText` | `ColorPickerChannelSliderValueText.svelte` | `—` |
| `ColorPickerContent` | `ColorPickerContent.svelte` | `—` |
| `ColorPickerControl` | `ColorPickerControl.svelte` | `—` |
| `ColorPickerEyeDropperTrigger` | `ColorPickerEyeDropperTrigger.svelte` | `none (aria-hidden)` |
| `ColorPickerFormatSelect` | `ColorPickerFormatSelect.svelte` | `none (aria-hidden)` |
| `ColorPickerFormatTrigger` | `ColorPickerFormatTrigger.svelte` | `—` |
| `ColorPickerHiddenInput` | `ColorPickerHiddenInput.svelte` | `—` |
| `ColorPickerLabel` | `ColorPickerLabel.svelte` | `—` |
| `ColorPickerPositioner` | `ColorPickerPositioner.svelte` | `—` |
| `ColorPickerRootProvider` | `ColorPickerRootProvider.svelte` | `—` |
| `ColorPickerSliders` | `ColorPickerSliders.svelte` | `—` |
| `ColorPickerSwatch` | `ColorPickerSwatch.svelte` | `—` |
| `ColorPickerSwatchGroup` | `ColorPickerSwatchGroup.svelte` | `group` |
| `ColorPickerSwatchIndicator` | `ColorPickerSwatchIndicator.svelte` | `none (aria-hidden)` |
| `ColorPickerSwatchTrigger` | `ColorPickerSwatchTrigger.svelte` | `—` |
| `ColorPickerTransparencyGrid` | `ColorPickerTransparencyGrid.svelte` | `—` |
| `ColorPickerTrigger` | `ColorPickerTrigger.svelte` | `—` |
| `ColorPickerValueSwatch` | `ColorPickerValueSwatch.svelte` | `—` |
| `ColorPickerValueText` | `ColorPickerValueText.svelte` | `—` |
| `ColorPickerView` | `ColorPickerView.svelte` | `—` |

ARIA roles rendered by this family: `group`, `presentation`, `slider`.

## Props

### `ColorPicker` — `ColorPickerRootProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseColorPickerProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseColorPickerProps` |
| `ids` | `ColorPickerElementIds` | — | from `UseColorPickerProps` |
| `value` | `string` | — | bindable from `UseColorPickerProps` |
| `defaultValue` | `string` | — | from `UseColorPickerProps` |
| `format` | `ColorFormat` | — | bindable from `UseColorPickerProps` |
| `defaultFormat` | `ColorFormat` | — | from `UseColorPickerProps` |
| `open` | `boolean` | — | bindable from `UseColorPickerProps` |
| `defaultOpen` | `boolean` | — | from `UseColorPickerProps` |
| `inline` | `boolean` | — | from `UseColorPickerProps` |
| `closeOnSelect` | `boolean` | — | from `UseColorPickerProps` |
| `disabled` | `boolean` | — | from `UseColorPickerProps` |
| `readOnly` | `boolean` | — | from `UseColorPickerProps` |
| `required` | `boolean` | — | from `UseColorPickerProps` |
| `invalid` | `boolean` | — | from `UseColorPickerProps` |
| `name` | `string` | — | from `UseColorPickerProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseColorPickerProps` |
| `positioning` | `PositionOptions` | — | from `UseColorPickerProps` |
| `openAutoFocus` | `boolean` | — | from `UseColorPickerProps` |
| `initialFocusEl` | `() => HTMLElement \| null \| false` | — | from `UseColorPickerProps` |
| `portalled` | `boolean` | — | from `UseColorPickerProps` |
| `portalRef` | `ColorPickerPortalRef` | — | from `UseColorPickerProps` |
| `lazyMount` | `boolean` | — | from `UseColorPickerProps` |
| `unmountOnExit` | `boolean` | — | from `UseColorPickerProps` |
| `onValueChange` | `(details: ColorPickerValueChangeDetails) => void` | — | from `UseColorPickerProps` |
| `onValueChangeEnd` | `(details: ColorPickerValueChangeDetails) => void` | — | from `UseColorPickerProps` |
| `onFormatChange` | `(details: ColorPickerFormatChangeDetails) => void` | — | from `UseColorPickerProps` |
| `onOpenChange` | `(details: ColorPickerOpenChangeDetails) => void` | — | from `UseColorPickerProps` |
| `onPointerDownOutside` | `(event: ColorPickerPointerDownOutsideEvent) => void` | — | from `UseColorPickerProps` |
| `onFocusOutside` | `(event: ColorPickerFocusOutsideEvent) => void` | — | from `UseColorPickerProps` |
| `onInteractOutside` | `(event: ColorPickerInteractOutsideEvent) => void` | — | from `UseColorPickerProps` |
| `children` | `Snippet` | — |  |

### `ColorPickerArea` — `ColorPickerAreaProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'role'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `xChannel` | `ColorChannel` | — | Channel driven by the horizontal axis. Defaults to the format's second channel. |
| `yChannel` | `ColorChannel` | — | Channel driven by the vertical axis. Defaults to the format's third channel. |

### `ColorPickerChannelInput` — `ColorPickerChannelInputProps`
accepts the native props of `Omit<HTMLProps<'input'>, 'type' | 'value'>`, `PolymorphicProps<'input'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `channel` | `ColorPickerChannelInputChannel` | — |  |

### `ColorPickerChannelSlider` — `ColorPickerChannelSliderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'role'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `channel` | `ColorChannel` | — |  |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |  |

### `ColorPickerChannelSliderValueText` — `ColorPickerChannelSliderValueTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `locale` | `string` | — | BCP 47 locale used to format the channel value. |

### `ColorPickerRootProvider` — `ColorPickerRootProviderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id' | 'children'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `ColorPickerApi` | — | API created outside the rendered tree with `createColorPicker`. |
| `children` | `Snippet` | — |  |

### `ColorPickerSwatch` — `ColorPickerSwatchProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string \| ColorType` | — |  |
| `respectAlpha` | `boolean` | `true` | Paint the swatch with its alpha, or as an opaque hex colour. |

### `ColorPickerSwatchTrigger` — `ColorPickerSwatchTriggerProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type' | 'value'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string \| ColorType` | — |  |
| `disabled` | `boolean` | — | Disables this swatch only, keeping the rest of the picker interactive. |

### `ColorPickerTransparencyGrid` — `ColorPickerTransparencyGridProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `size` | `string` | — | Size of one checkerboard cell. |

### `ColorPickerValueSwatch` — `ColorPickerValueSwatchProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'value'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `respectAlpha` | `boolean` | `true` | Paint the swatch with its alpha, or as an opaque hex colour. |

### `ColorPickerValueText` — `ColorPickerValueTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `format` | `ColorStringFormat` | — | Overrides the string format of the rendered value. |

### `ColorPickerView` — `ColorPickerViewProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `format` | `ColorFormat` | — | Only renders while the picker's current format matches. |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `ColorPicker` | `color-picker` | `root` | `color-picker-root` |
| `ColorPickerArea` | `color-picker` | `area` | `color-picker-area` |
| `ColorPickerAreaBackground` | `color-picker` | `area-background` | `color-picker-area-background` |
| `ColorPickerAreaThumb` | `color-picker` | `area-thumb` | `color-picker-area-thumb` |
| `ColorPickerChannelInput` | `color-picker` | `channel-input` | `color-picker-channel-input` |
| `ColorPickerChannelSlider` | `color-picker` | `channel-slider` | `color-picker-channel-slider` |
| `ColorPickerChannelSliderLabel` | `color-picker` | `channel-slider-label` | `color-picker-channel-slider-label` |
| `ColorPickerChannelSliderThumb` | `color-picker` | `channel-slider-thumb` | `color-picker-channel-slider-thumb` |
| `ColorPickerChannelSliderTrack` | `color-picker` | `channel-slider-track` | `color-picker-channel-slider-track` |
| `ColorPickerChannelSliderValueText` | `color-picker` | `channel-slider-value-text` | `color-picker-channel-slider-value-text` |
| `ColorPickerContent` | `color-picker` | `content` | `color-picker-content` |
| `ColorPickerControl` | `color-picker` | `control` | `color-picker-control` |
| `ColorPickerEyeDropperTrigger` | `color-picker` | `eye-dropper-trigger` | `color-picker-eye-dropper-trigger` |
| `ColorPickerFormatSelect` | `color-picker` | `format-select` | `color-picker-format-select` |
| `ColorPickerFormatTrigger` | `color-picker` | `format-trigger` | `color-picker-format-trigger` |
| `ColorPickerHiddenInput` | `color-picker` | `hidden-input` | `color-picker-hidden-input` |
| `ColorPickerLabel` | `color-picker` | `label` | `color-picker-label` |
| `ColorPickerPositioner` | `color-picker` | `positioner` | `color-picker-positioner` |
| `ColorPickerRootProvider` | `color-picker` | `root` | `color-picker-root-provider` |
| `ColorPickerSliders` | `—` | `—` | `color-picker-sliders` |
| `ColorPickerSwatch` | `color-picker` | `swatch` | `color-picker-swatch` |
| `ColorPickerSwatchGroup` | `color-picker` | `swatch-group` | `color-picker-swatch-group` |
| `ColorPickerSwatchIndicator` | `color-picker` | `swatch-indicator` | `color-picker-swatch-indicator` |
| `ColorPickerSwatchTrigger` | `color-picker` | `swatch-trigger` | `color-picker-swatch-trigger` |
| `ColorPickerTransparencyGrid` | `color-picker` | `transparency-grid` | `color-picker-transparency-grid` |
| `ColorPickerTrigger` | `color-picker` | `trigger` | `color-picker-trigger` |
| `ColorPickerValueSwatch` | `color-picker` | `swatch` | `color-picker-value-swatch` |
| `ColorPickerValueText` | `color-picker` | `value-text` | `color-picker-value-text` |
| `ColorPickerView` | `color-picker` | `view` | `color-picker-view` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-color-picker-area-height` | `10rem` |
| `--moduix-color-picker-channel-slider-height` | `var(--moduix-spacing-3)` |
| `--moduix-color-picker-content-width` | `16rem` |
| `--moduix-color-picker-radius` | `var(--moduix-radius-md)` |
| `--moduix-color-picker-swatch-size` | `var(--moduix-size-sm)` |
| `--moduix-color-picker-thumb-size` | `var(--moduix-spacing-4)` |
| `--moduix-color-picker-trigger-size` | `var(--moduix-size-md)` |
| `--moduix-color-picker-width` | `16rem` |

## Keyboard

Keys handled by this family: `End`, `Escape`, `Home`, `PageDown`, `PageUp`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `color-picker:${id}`
- `color-picker:${id}:area`
- `color-picker:${id}:area-gradient`
- `color-picker:${id}:area-thumb`
- `color-picker:${id}:content`
- `color-picker:${id}:control`
- `color-picker:${id}:format-select`
- `color-picker:${id}:hidden-input`
- `color-picker:${id}:label`
- `color-picker:${id}:positioner`
- `color-picker:${id}:slider-thumb:${id}`
- `color-picker:${id}:slider-track:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerChannelInput,
		ColorPickerContent,
		ColorPickerControl,
		ColorPickerEyeDropperTrigger,
		ColorPickerFormatSelect,
		ColorPickerHiddenInput,
		ColorPickerLabel,
		ColorPickerPositioner,
		ColorPickerSliders,
		ColorPickerSwatchGroup,
		ColorPickerSwatchTrigger,
		ColorPickerTrigger
	} from 'rta-ui';

	const swatches = ['#0f172a', '#2563eb', '#16a34a', '#f97316'];
</script>

<ColorPicker defaultValue="#eb5e41" name="accent" closeOnSelect>
	<ColorPickerLabel>Accent</ColorPickerLabel>
	<ColorPickerControl>
		<ColorPickerChannelInput channel="hex" />
		<ColorPickerChannelInput channel="alpha" />
		<ColorPickerTrigger />
	</ColorPickerControl>
	<ColorPickerPositioner>
		<ColorPickerContent>
			<ColorPickerArea />
			<div class="row">
				<ColorPickerEyeDropperTrigger />
				<ColorPickerSliders />
			</div>
			<ColorPickerSwatchGroup>
				{#each swatches as color (color)}
					<ColorPickerSwatchTrigger value={color} />
				{/each}
			</ColorPickerSwatchGroup>
			<ColorPickerFormatSelect />
		</ColorPickerContent>
	</ColorPickerPositioner>
	<ColorPickerHiddenInput />
</ColorPicker>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
</style>
```

## Behaviour covered by tests

- renders the Zag ids, hooks and inline styles for every part
- converts a pointer position in the area into channel values
- steps the hue slider with the keyboard
- commits typed channel input into the hidden form field
- selects a swatch and closes the portalled popup when closeOnSelect is set
- switches format through the select and shows the matching view
- exposes the disabled and read-only state hooks
- shares state created outside the tree through the root provider

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable.
  Extra slots: `color-picker-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
