---
title: Checkbox
component: checkbox
description: Turn an option on or off, alone or as part of a group.
---

# Checkbox

Turn an option on or off, alone or as part of a group.

Port of `moduix/packages/svelte/src/components/checkbox` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Checkbox } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Checkbox` | `Checkbox.svelte` | `—` |
| `CheckboxControl` | `CheckboxControl.svelte` | `—` |
| `CheckboxGroup` | `CheckboxGroup.svelte` | `group` |
| `CheckboxHiddenInput` | `CheckboxHiddenInput.svelte` | `—` |
| `CheckboxIndicator` | `CheckboxIndicator.svelte` | `—` |
| `CheckboxLabel` | `CheckboxLabel.svelte` | `—` |
| `CheckboxRootProvider` | `CheckboxRootProvider.svelte` | `—` |

ARIA roles rendered by this family: `group`.

## Props

### `Checkbox` — `CheckboxRootProps`
accepts the native props of `HTMLProps<'label'>`, `PolymorphicProps<'label'>`, `RefAttribute`, and adds to `Omit<UseCheckboxProps, 'form'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `indeterminate` | `boolean` | — | from `UseCheckboxProps` |
| `form` | `string` | — |  |
| `size` | `CheckboxSize` | `'md'` |  |

### `CheckboxGroup` — `CheckboxGroupProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseCheckboxGroupProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string[]` | — | bindable from `UseCheckboxGroupProps` |
| `defaultValue` | `string[]` | — | from `UseCheckboxGroupProps` |
| `onValueChange` | `(details: { value: string[] }) => void` | — | from `UseCheckboxGroupProps` |
| `disabled` | `boolean` | — | from `UseCheckboxGroupProps` |
| `invalid` | `boolean` | — | from `UseCheckboxGroupProps` |
| `readOnly` | `boolean` | — | from `UseCheckboxGroupProps` |
| `required` | `boolean` | — | from `UseCheckboxGroupProps` |
| `name` | `string` | — | from `UseCheckboxGroupProps` |
| `form` | `string` | — | from `UseCheckboxGroupProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseCheckboxGroupProps` |
| `id` | `string \| null` | — | from `UseCheckboxGroupProps` |
| `ids` | `{ root?: string; group?: string }` | — | from `UseCheckboxGroupProps` |

### `CheckboxIndicator` — `CheckboxIndicatorProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `indeterminate` | `boolean` | — |  |

### `CheckboxRootProvider` — `CheckboxRootProviderProps`
accepts the native props of `HTMLProps<'label'>`, `PolymorphicProps<'label'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `CheckboxApi` | — |  |
| `size` | `CheckboxSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Checkbox` | `checkbox` | `root` | `checkbox-root` |
| `CheckboxControl` | `checkbox` | `control` | `checkbox-control` |
| `CheckboxGroup` | `checkbox` | `group` | `checkbox-group` |
| `CheckboxIndicator` | `checkbox` | `indicator` | `checkbox-indicator` |
| `CheckboxLabel` | `checkbox` | `label` | `checkbox-label` |
| `CheckboxRootProvider` | `checkbox` | `root` | `checkbox-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-checkbox-bg` | `var(--moduix-background)` |
| `--moduix-checkbox-bg-checked` | `var(--moduix-primary)` |
| `--moduix-checkbox-border-color` | `var(--moduix-input)` |
| `--moduix-checkbox-color` | `var(--moduix-primary-foreground)` |
| `--moduix-checkbox-gap` | `var(--moduix-spacing-2)` |
| `--moduix-checkbox-icon-size` | `var(--_checkbox-icon-size)` |
| `--moduix-checkbox-radius` | `var(--moduix-radius-xs)` |
| `--moduix-checkbox-size` | `var(--_checkbox-size)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { Checkbox, CheckboxControl, CheckboxLabel } from 'rta-ui';

	let checked = $state(false);
	let indeterminate = $state(true);
</script>

<Checkbox bind:checked>
	<CheckboxControl />
	<CheckboxLabel>Accept terms</CheckboxLabel>
</Checkbox>
<Checkbox bind:checked={indeterminate} defaultChecked={false}>
	<CheckboxControl />
	<CheckboxLabel>Select all</CheckboxLabel>
</Checkbox>
```

## Behaviour covered by tests

- renders the ark contract
- toggles and reports changes
- indeterminate wins over checked for data-state and indicators
- disabled blocks interaction
- group owns the value of its checkboxes

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
