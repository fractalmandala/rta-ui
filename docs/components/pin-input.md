---
title: PinInput
component: pin-input
description: Enter a short PIN or one-time code, one character per box.
---

# PinInput

Enter a short PIN or one-time code, one character per box.

Port of `moduix/packages/svelte/src/components/pin-input` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { PinInput } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `PinInput` | `PinInput.svelte` | `—` |
| `PinInputControl` | `PinInputControl.svelte` | `group` |
| `PinInputHiddenInput` | `PinInputHiddenInput.svelte` | `—` |
| `PinInputInput` | `PinInputInput.svelte` | `—` |
| `PinInputInputs` | `PinInputInputs.svelte` | `—` |
| `PinInputLabel` | `PinInputLabel.svelte` | `—` |
| `PinInputRootProvider` | `PinInputRootProvider.svelte` | `—` |
| `PinInputSeparator` | `PinInputSeparator.svelte` | `none (aria-hidden)` |

ARIA roles rendered by this family: `group`.

## Props

### `PinInput` — `PinInputRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `Omit<UsePinInputProps, 'placeholder'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | — | from `UsePinInputProps` |
| `autoSubmit` | `boolean` | — | from `UsePinInputProps` |
| `blurOnComplete` | `boolean` | — | from `UsePinInputProps` |
| `count` | `number` | — | from `UsePinInputProps` |
| `defaultValue` | `string[]` | — | from `UsePinInputProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UsePinInputProps` |
| `disabled` | `boolean` | — | from `UsePinInputProps` |
| `form` | `string` | — | from `UsePinInputProps` |
| `id` | `string \| null` | — | from `UsePinInputProps` |
| `ids` | `PinInputElementIds` | — | from `UsePinInputProps` |
| `invalid` | `boolean` | — | from `UsePinInputProps` |
| `mask` | `boolean` | — | from `UsePinInputProps` |
| `name` | `string` | — | from `UsePinInputProps` |
| `onValueChange` | `(details: PinInputValueChangeDetails) => void` | — | from `UsePinInputProps` |
| `onValueComplete` | `(details: PinInputValueCompleteDetails) => void` | — | from `UsePinInputProps` |
| `onValueInvalid` | `(details: PinInputValueInvalidDetails) => void` | — | from `UsePinInputProps` |
| `otp` | `boolean` | — | from `UsePinInputProps` |
| `pattern` | `string` | — | from `UsePinInputProps` |
| `placeholder` | `string` | `''` | from `UsePinInputProps` |
| `readOnly` | `boolean` | — | from `UsePinInputProps` |
| `required` | `boolean` | — | from `UsePinInputProps` |
| `sanitizeValue` | `(value: string) => string` | — | from `UsePinInputProps` |
| `selectOnFocus` | `boolean` | — | from `UsePinInputProps` |
| `translations` | `{ inputLabel?: (index: number, length: number) => string }` | — | from `UsePinInputProps` |
| `type` | `PinInputType` | — | from `UsePinInputProps` |
| `value` | `string[]` | — | bindable from `UsePinInputProps` |
| `size` | `PinInputSize` | `'md'` |  |

### `PinInputInput` — `PinInputInputProps`
accepts the native props of `Omit<HTMLProps<'input'>, 'value'>`, `PolymorphicProps<'input'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |

### `PinInputInputs` — `PinInputInputsProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `class` | `ClassValue` | — |  |

### `PinInputRootProvider` — `PinInputRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `PinInputApi` | — |  |
| `size` | `PinInputSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `PinInput` | `pin-input` | `root` | `pin-input-root` |
| `PinInputControl` | `pin-input` | `control` | `pin-input-control` |
| `PinInputHiddenInput` | `pin-input` | `hidden-input` | `pin-input-hidden-input` |
| `PinInputInput` | `pin-input` | `input` | `pin-input-input` |
| `PinInputLabel` | `pin-input` | `label` | `pin-input-label` |
| `PinInputRootProvider` | `pin-input` | `root` | `pin-input-root-provider` |
| `PinInputSeparator` | `pin-input` | `separator` | `pin-input-separator` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-pin-input-gap` | `var(--moduix-spacing-2)` |
| `--moduix-pin-input-input-size` | `var(--_pin-input-input-size)` |
| `--moduix-pin-input-radius` | `var(--moduix-radius-md)` |

## Keyboard

Keys handled by this family: `←SpaceArrowLeft`, `→SpaceArrowRight`.

## Generated ids

- `pin-input:${id}`
- `pin-input:${id}:${id}`
- `pin-input:${id}:control`
- `pin-input:${id}:hidden`
- `pin-input:${id}:label`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		PinInput,
		PinInputControl,
		PinInputHiddenInput,
		PinInputInputs,
		PinInputLabel
	} from 'rta-ui';

	let value = $state(['', '', '', '']);
	let complete = $state(false);
</script>

<PinInput count={4} bind:value onValueComplete={() => (complete = true)}>
	<PinInputLabel>Verification code</PinInputLabel>
	<PinInputControl>
		<PinInputInputs />
	</PinInputControl>
	<PinInputHiddenInput name="code" />
</PinInput>

<p>Value: {value.join('') || 'empty'}</p>
<p>Status: {complete ? 'complete' : 'incomplete'}</p>
<button type="button" onclick={() => (value = ['', '', '', ''])}>Clear</button>
```

## Behaviour covered by tests

- renders the Ark contract
- typing fills the value, advances focus and mirrors into the hidden input
- ignores characters outside the numeric pattern and reports them
- keyboard navigation and backspace follow the machine
- disables, masks and marks invalid parts from props

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable.
  Extra slots: `pin-input-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
