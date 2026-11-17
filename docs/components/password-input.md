---
title: PasswordInput
component: password-input
description: Enter a password with a button that shows or hides it.
---

# PasswordInput

Enter a password with a button that shows or hides it.

Port of `moduix/packages/svelte/src/components/password-input` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { PasswordInput } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `PasswordInput` | `PasswordInput.svelte` | `—` |
| `PasswordInputControl` | `PasswordInputControl.svelte` | `—` |
| `PasswordInputField` | `PasswordInputField.svelte` | `—` |
| `PasswordInputIndicator` | `PasswordInputIndicator.svelte` | `none (aria-hidden)` |
| `PasswordInputInput` | `PasswordInputInput.svelte` | `—` |
| `PasswordInputLabel` | `PasswordInputLabel.svelte` | `—` |
| `PasswordInputRootProvider` | `PasswordInputRootProvider.svelte` | `—` |
| `PasswordInputVisibilityTrigger` | `PasswordInputVisibilityTrigger.svelte` | `—` |

## Props

### `PasswordInput` — `PasswordInputRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UsePasswordInputProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `autoComplete` | `string` | — | from `UsePasswordInputProps` |
| `defaultVisible` | `boolean` | — | from `UsePasswordInputProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UsePasswordInputProps` |
| `disabled` | `boolean` | — | from `UsePasswordInputProps` |
| `id` | `string \| null` | — | from `UsePasswordInputProps` |
| `ids` | `PasswordInputElementIds` | — | from `UsePasswordInputProps` |
| `ignorePasswordManagers` | `boolean` | — | from `UsePasswordInputProps` |
| `invalid` | `boolean` | — | from `UsePasswordInputProps` |
| `name` | `string` | — | from `UsePasswordInputProps` |
| `onVisibilityChange` | `(details: PasswordInputVisibilityChangeDetails) => void` | — | from `UsePasswordInputProps` |
| `readOnly` | `boolean` | — | from `UsePasswordInputProps` |
| `required` | `boolean` | — | from `UsePasswordInputProps` |
| `translations` | `{ visibilityTrigger?: (visible: boolean) => string }` | — | from `UsePasswordInputProps` |
| `visible` | `boolean` | — | bindable from `UsePasswordInputProps` |
| `size` | `PasswordInputSize` | `'md'` |  |

### `PasswordInputIndicator` — `PasswordInputIndicatorProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `fallback` | `Snippet` | — | The fallback content to display when the password is not visible. |
| `children` | `Snippet` | — |  |

### `PasswordInputRootProvider` — `PasswordInputRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `PasswordInputApi` | — |  |
| `size` | `PasswordInputSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `PasswordInput` | `password-input` | `root` | `password-input-root` |
| `PasswordInputControl` | `password-input` | `control` | `password-input-control` |
| `PasswordInputIndicator` | `password-input` | `indicator` | `password-input-indicator` |
| `PasswordInputInput` | `password-input` | `input` | `password-input-input` |
| `PasswordInputLabel` | `password-input` | `label` | `password-input-label` |
| `PasswordInputRootProvider` | `password-input` | `root` | `password-input-root-provider` |
| `PasswordInputVisibilityTrigger` | `password-input` | `visibility-trigger` | `password-input-visibility-trigger` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-password-input-height` | `var(--_password-input-height)` |
| `--moduix-password-input-radius` | `var(--moduix-radius-md)` |
| `--moduix-password-input-width` | `100%` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		PasswordInput,
		PasswordInputField,
		PasswordInputLabel
	} from 'rta-ui';
	import { Field, FieldHelperText } from 'rta-ui';

	let visible = $state(false);
</script>

<Field id="demo-password">
	<PasswordInput bind:visible name="password">
		<PasswordInputLabel>Password</PasswordInputLabel>
		<PasswordInputField />
	</PasswordInput>
	<FieldHelperText>Use at least 8 characters.</FieldHelperText>
</Field>

<p>Visible: {visible ? 'yes' : 'no'}</p>
```

## Behaviour covered by tests

- renders the Ark contract
- clicking the trigger reveals the value and swaps the label
- pointer down toggles once and the trailing click does not double-toggle
- disabled and read-only parts block the visibility trigger
- stays inert while read-only

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
