---
title: RatingGroup
component: rating-group
description: Rate something on a scale of stars, including half-star steps.
---

# RatingGroup

Rate something on a scale of stars, including half-star steps.

Port of `moduix/packages/svelte/src/components/rating-group` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { RatingGroup } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `RatingGroup` | `RatingGroup.svelte` | `—` |
| `RatingGroupControl` | `RatingGroupControl.svelte` | `radiogroup` |
| `RatingGroupHiddenInput` | `RatingGroupHiddenInput.svelte` | `—` |
| `RatingGroupItem` | `RatingGroupItem.svelte` | `radio` |
| `RatingGroupItemIndicator` | `RatingGroupItemIndicator.svelte` | `—` |
| `RatingGroupItems` | `RatingGroupItems.svelte` | `—` |
| `RatingGroupLabel` | `RatingGroupLabel.svelte` | `—` |
| `RatingGroupRootProvider` | `RatingGroupRootProvider.svelte` | `—` |

ARIA roles rendered by this family: `radio`, `radiogroup`.

## Props

### `RatingGroup` — `RatingGroupRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseRatingGroupProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `number` | — | bindable from `UseRatingGroupProps` |
| `defaultValue` | `number` | — | from `UseRatingGroupProps` |
| `count` | `number` | — | from `UseRatingGroupProps` |
| `allowHalf` | `boolean` | — | from `UseRatingGroupProps` |
| `disabled` | `boolean` | — | from `UseRatingGroupProps` |
| `readOnly` | `boolean` | — | from `UseRatingGroupProps` |
| `required` | `boolean` | — | from `UseRatingGroupProps` |
| `name` | `string` | — | from `UseRatingGroupProps` |
| `form` | `string` | — | from `UseRatingGroupProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseRatingGroupProps` |
| `id` | `string \| null` | — | from `UseRatingGroupProps` |
| `ids` | `{
		root?: string;
		label?: string;
		control?: string;
		hiddenInput?: string;
		item?: (index: number) => string;
	}` | — | from `UseRatingGroupProps` |
| `translations` | `{ ratingValueText?: (index: number) => string }` | — | from `UseRatingGroupProps` |
| `onValueChange` | `(details: RatingGroupValueChangeDetails) => void` | — | from `UseRatingGroupProps` |
| `onHoverChange` | `(details: RatingGroupHoverChangeDetails) => void` | — | from `UseRatingGroupProps` |
| `size` | `RatingGroupSize` | `'md'` |  |

### `RatingGroupItem` — `RatingGroupItemProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |

### `RatingGroupItems` — `RatingGroupItemsProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet` | — |  |

### `RatingGroupRootProvider` — `RatingGroupRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `RatingGroupApi` | — |  |
| `size` | `RatingGroupSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `RatingGroup` | `rating-group` | `root` | `rating-group-root` |
| `RatingGroupControl` | `rating-group` | `control` | `rating-group-control` |
| `RatingGroupHiddenInput` | `rating-group` | `hidden-input` | `rating-group-hidden-input` |
| `RatingGroupItem` | `rating-group` | `item` | `rating-group-item` |
| `RatingGroupItemIndicator` | `rating-group` | `item-indicator` | `rating-group-item-indicator` |
| `RatingGroupLabel` | `rating-group` | `label` | `rating-group-label` |
| `RatingGroupRootProvider` | `rating-group` | `root` | `rating-group-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-rating-group-active-color` | `var(--moduix-primary)` |
| `--moduix-rating-group-color` | `var(--moduix-muted-foreground)` |
| `--moduix-rating-group-gap` | `var(--moduix-spacing-1)` |
| `--moduix-rating-group-icon-size` | `var(--_rating-group-icon-size)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `rating-group:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		RatingGroup,
		RatingGroupControl,
		RatingGroupHiddenInput,
		RatingGroupItems,
		RatingGroupLabel
	} from 'rta-ui';
</script>

<RatingGroup defaultValue={4} allowHalf>
	<RatingGroupLabel>Overall satisfaction</RatingGroupLabel>
	<RatingGroupControl>
		<RatingGroupItems />
	</RatingGroupControl>
	<RatingGroupHiddenInput />
</RatingGroup>
```

## Behaviour covered by tests

- renders the Ark contract
- clicking an item sets the value and highlights up to it
- half ratings round up for data-half markers
- a read-only group blocks changes
- arrow keys step the value and Home/End jump

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so form submission stays reachable.
  Extra slots: `rating-group-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
