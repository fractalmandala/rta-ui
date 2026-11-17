---
title: NumberInput
component: number-input
description: Enter a number with step buttons, limits, and locale formatting.
---

# NumberInput

Enter a number with step buttons, limits, and locale formatting.

Port of `moduix/packages/svelte/src/components/number-input` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { NumberInput } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `NumberInput` | `NumberInput.svelte` | `—` |
| `NumberInputControl` | `NumberInputControl.svelte` | `—` |
| `NumberInputDecrementTrigger` | `NumberInputDecrementTrigger.svelte` | `none (aria-hidden)` |
| `NumberInputField` | `NumberInputField.svelte` | `—` |
| `NumberInputIncrementTrigger` | `NumberInputIncrementTrigger.svelte` | `none (aria-hidden)` |
| `NumberInputInput` | `NumberInputInput.svelte` | `—` |
| `NumberInputLabel` | `NumberInputLabel.svelte` | `—` |
| `NumberInputRootProvider` | `NumberInputRootProvider.svelte` | `—` |
| `NumberInputScrubber` | `NumberInputScrubber.svelte` | `—` |
| `NumberInputValueText` | `NumberInputValueText.svelte` | `—` |

ARIA roles rendered by this family: `group`, `presentation`, `spinbutton`.

## Props

### `NumberInput` — `NumberInputRootProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'size'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseNumberInputProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseNumberInputProps` |
| `ids` | `NumberInputElementIds` | — | from `UseNumberInputProps` |
| `dir` | `NumberInputDir \| null` | — | from `UseNumberInputProps` |
| `locale` | `string` | — | from `UseNumberInputProps` |
| `formatOptions` | `Intl.NumberFormatOptions` | — | from `UseNumberInputProps` |
| `name` | `string` | — | from `UseNumberInputProps` |
| `form` | `string` | — | from `UseNumberInputProps` |
| `disabled` | `boolean` | — | from `UseNumberInputProps` |
| `readOnly` | `boolean` | — | from `UseNumberInputProps` |
| `invalid` | `boolean` | — | from `UseNumberInputProps` |
| `required` | `boolean` | — | from `UseNumberInputProps` |
| `pattern` | `string` | — | from `UseNumberInputProps` |
| `value` | `string` | — | bindable from `UseNumberInputProps` |
| `defaultValue` | `string` | — | from `UseNumberInputProps` |
| `min` | `number` | — | from `UseNumberInputProps` |
| `max` | `number` | — | from `UseNumberInputProps` |
| `step` | `number` | — | from `UseNumberInputProps` |
| `largeStep` | `number` | — | from `UseNumberInputProps` |
| `smallStep` | `number` | — | from `UseNumberInputProps` |
| `allowMouseWheel` | `boolean` | — | from `UseNumberInputProps` |
| `allowOverflow` | `boolean` | — | from `UseNumberInputProps` |
| `clampValueOnBlur` | `boolean` | — | from `UseNumberInputProps` |
| `focusInputOnChange` | `boolean` | — | from `UseNumberInputProps` |
| `inputMode` | `NumberInputInputMode` | — | from `UseNumberInputProps` |
| `spinOnPress` | `boolean` | — | from `UseNumberInputProps` |
| `translations` | `NumberInputTranslations` | — | from `UseNumberInputProps` |
| `onValueChange` | `(details: NumberInputValueChangeDetails) => void` | — | from `UseNumberInputProps` |
| `onValueInvalid` | `(details: NumberInputValueInvalidDetails) => void` | — | from `UseNumberInputProps` |
| `onFocusChange` | `(details: NumberInputFocusChangeDetails) => void` | — | from `UseNumberInputProps` |
| `onValueCommit` | `(details: NumberInputValueChangeDetails) => void` | — | from `UseNumberInputProps` |
| `size` | `NumberInputSize` | `'md'` |  |

### `NumberInputRootProvider` — `NumberInputRootProviderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'size'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `NumberInputApi` | — |  |
| `size` | `NumberInputSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `NumberInput` | `number-input` | `root` | `number-input-root` |
| `NumberInputControl` | `number-input` | `control` | `number-input-control` |
| `NumberInputDecrementTrigger` | `number-input` | `decrement-trigger` | `number-input-decrement-trigger` |
| `NumberInputIncrementTrigger` | `number-input` | `increment-trigger` | `number-input-increment-trigger` |
| `NumberInputInput` | `number-input` | `input` | `number-input-input` |
| `NumberInputLabel` | `number-input` | `label` | `number-input-label` |
| `NumberInputRootProvider` | `number-input` | `root-provider` | `number-input-root-provider` |
| `NumberInputScrubber` | `number-input` | `scrubber` | `number-input-scrubber` |
| `NumberInputValueText` | `number-input` | `value-text` | `number-input-value-text` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-number-input-control-height` | `var(--_number-input-height)` |
| `--moduix-number-input-input-width` | `6rem` |
| `--moduix-number-input-radius` | `var(--moduix-radius-md)` |

## Keyboard

Keys handled by this family: `End`, `Enter`, `Home`, `PageDown`, `PageUp`, `↑SpaceArrowUp`, `↓SpaceArrowDown`.

## Generated ids

- `number-input:${id}`
- `number-input:${id}:cursor`
- `number-input:${id}:dec`
- `number-input:${id}:inc`
- `number-input:${id}:input`
- `number-input:${id}:label`
- `number-input:${id}:scrubber`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		NumberInput,
		NumberInputControl,
		NumberInputDecrementTrigger,
		NumberInputIncrementTrigger,
		NumberInputInput,
		NumberInputLabel,
		NumberInputScrubber
	} from 'rta-ui';

	let quantity = $state('1');
	let price = $state('19.99');
</script>

<NumberInput bind:value={quantity} min={0} max={20} step={1}>
	<NumberInputLabel>Quantity</NumberInputLabel>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInput>

<p>Ordering {quantity} item{quantity === '1' ? '' : 's'}</p>

<NumberInput
	bind:value={price}
	min={0}
	max={1000}
	step={0.5}
	locale="en-US"
	formatOptions={{ style: 'currency', currency: 'USD' }}
>
	<NumberInputLabel>Unit price</NumberInputLabel>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInput>

<p>Unit price: {price}</p>

<NumberInput defaultValue="50" min={0} max={100} step={1} size="lg">
	<NumberInputLabel>Drag to scrub</NumberInputLabel>
	<NumberInputScrubber>Scrub</NumberInputScrubber>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInput>
```

## Behaviour covered by tests

- renders every part with the moduix hooks and the Zag id set
- renders through the root provider
- keeps the raw value while typing and formats on blur
- formats percent values from the display string
- formats with the locale and compares typed text in range
- marks invalid while out of range and clamps on blur
- reports the invalid reason when overflow is allowed
- steps with the keyboard, including large and small steps
- clamps stepped values and honours custom large and small steps
- increments on trigger press and repeats while held
- spins with the mouse wheel only when it is allowed and focused
- scrubs while dragging and cleans up the virtual cursor
- scrubs on touch pointers through ownerDocument pointer events
- mirrors disabled, read-only and required affordances
- never renders a value text duplicate of the raw input value
- notifies value change only when the value actually changes
- exposes translated value text through aria-valuetext
- emits a single root per render

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
