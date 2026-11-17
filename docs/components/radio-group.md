---
title: RadioGroup
component: radio-group
description: Choose exactly one option from a short visible list.
---

# RadioGroup

Choose exactly one option from a short visible list.

Port of `moduix/packages/svelte/src/components/radio-group` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { RadioGroup } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `RadioGroup` | `RadioGroup.svelte` | `radiogroup` |
| `RadioGroupIndicator` | `RadioGroupIndicator.svelte` | `—` |
| `RadioGroupItem` | `RadioGroupItem.svelte` | `—` |
| `RadioGroupItemControl` | `RadioGroupItemControl.svelte` | `—` |
| `RadioGroupItemHiddenInput` | `RadioGroupItemHiddenInput.svelte` | `—` |
| `RadioGroupItemText` | `RadioGroupItemText.svelte` | `—` |
| `RadioGroupLabel` | `RadioGroupLabel.svelte` | `—` |
| `RadioGroupOption` | `RadioGroupOption.svelte` | `—` |
| `RadioGroupRootProvider` | `RadioGroupRootProvider.svelte` | `—` |

ARIA roles rendered by this family: `radiogroup`.

## Props

### `RadioGroup` — `RadioGroupRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseRadioGroupProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | bindable from `UseRadioGroupProps` |
| `defaultValue` | `string \| null` | — | from `UseRadioGroupProps` |
| `onValueChange` | `(details: RadioGroupValueChangeDetails) => void` | — | from `UseRadioGroupProps` |
| `disabled` | `boolean` | — | from `UseRadioGroupProps` |
| `invalid` | `boolean` | — | from `UseRadioGroupProps` |
| `readOnly` | `boolean` | — | from `UseRadioGroupProps` |
| `required` | `boolean` | — | from `UseRadioGroupProps` |
| `name` | `string` | — | from `UseRadioGroupProps` |
| `form` | `string` | — | from `UseRadioGroupProps` |
| `orientation` | `'horizontal' \| 'vertical'` | — | from `UseRadioGroupProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseRadioGroupProps` |
| `id` | `string \| null` | — | from `UseRadioGroupProps` |
| `ids` | `{
		root?: string;
		label?: string;
		indicator?: string;
		item?: (value: string) => string;
		itemLabel?: (value: string) => string;
		itemControl?: (value: string) => string;
		itemHiddenInput?: (value: string) => string;
	}` | — | from `UseRadioGroupProps` |
| `size` | `RadioGroupSize` | `'md'` |  |

### `RadioGroupItem` — `RadioGroupItemProps`
accepts the native props of `HTMLProps<'label'>`, `PolymorphicProps<'label'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `RadioGroupItemControl` — `RadioGroupItemControlProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `RadioGroupItemHiddenInput` — `RadioGroupItemHiddenInputProps`
accepts the native props of `HTMLProps<'input'>`, `PolymorphicProps<'input'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `RadioGroupItemText` — `RadioGroupItemTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `RadioGroupOption` — `RadioGroupOptionProps`
accepts the native props of `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |
| `children` | `Snippet` | — |  |

### `RadioGroupRootProvider` — `RadioGroupRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `RadioGroupApi` | — |  |
| `size` | `RadioGroupSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `RadioGroup` | `radio-group` | `root` | `radio-group-root` |
| `RadioGroupIndicator` | `radio-group` | `indicator` | `radio-group-indicator` |
| `RadioGroupItem` | `radio-group` | `item` | `radio-group-item` |
| `RadioGroupItemControl` | `radio-group` | `item-control` | `radio-group-item-control` |
| `RadioGroupItemHiddenInput` | `radio-group` | `item-hidden-input` | `radio-group-item-hidden-input` |
| `RadioGroupItemText` | `radio-group` | `item-text` | `radio-group-item-text` |
| `RadioGroupLabel` | `radio-group` | `label` | `radio-group-label` |
| `RadioGroupRootProvider` | `radio-group` | `root` | `radio-group-root-provider` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `radio-group:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { RadioGroup, RadioGroupLabel, RadioGroupOption } from 'rta-ui';

	let value = $state('card');
</script>

<RadioGroup bind:value name="payment">
	<RadioGroupLabel>Payment method</RadioGroupLabel>
	<RadioGroupOption value="card">Card</RadioGroupOption>
	<RadioGroupOption value="cash">Cash</RadioGroupOption>
	<RadioGroupOption value="crypto" disabled>Crypto</RadioGroupOption>
</RadioGroup>
```

## Behaviour covered by tests

- renders the ark contract
- selecting an item reports the value and updates state
- group disabled blocks selection
- readOnly blocks selection
- required and invalid are announced
- hovering and focusing mark the item

## Notes

- **Parity:** accepted deviation — The hidden radio input is an Ark internal upstream; here it is a public part so native radio semantics stay reachable.
  Extra slots: `radio-group-item-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
