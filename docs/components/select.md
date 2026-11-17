---
title: Select
component: select
description: Pick one or more values from a popup list of options.
---

# Select

Pick one or more values from a popup list of options.

Port of `moduix/packages/svelte/src/components/select` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Select } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Select` | `Select.svelte` | `—` |
| `SelectClearTrigger` | `SelectClearTrigger.svelte` | `—` |
| `SelectContent` | `SelectContent.svelte` | `—` |
| `SelectControl` | `SelectControl.svelte` | `—` |
| `SelectField` | `SelectField.svelte` | `—` |
| `SelectHiddenSelect` | `SelectHiddenSelect.svelte` | `—` |
| `SelectIndicator` | `SelectIndicator.svelte` | `none (aria-hidden)` |
| `SelectItem` | `SelectItem.svelte` | `—` |
| `SelectItemGroup` | `SelectItemGroup.svelte` | `—` |
| `SelectItemGroupLabel` | `SelectItemGroupLabel.svelte` | `—` |
| `SelectItemIndicator` | `SelectItemIndicator.svelte` | `—` |
| `SelectItemText` | `SelectItemText.svelte` | `—` |
| `SelectLabel` | `SelectLabel.svelte` | `—` |
| `SelectList` | `SelectList.svelte` | `—` |
| `SelectOption` | `SelectOption.svelte` | `—` |
| `SelectPositioner` | `SelectPositioner.svelte` | `—` |
| `SelectRootProvider` | `SelectRootProvider.svelte` | `—` |
| `SelectTrigger` | `SelectTrigger.svelte` | `—` |
| `SelectValueText` | `SelectValueText.svelte` | `—` |

ARIA roles rendered by this family: `combobox`, `group`, `option`, `presentation`.

## Props

### `SelectField` — `SelectFieldProps`
adds to `Omit<SelectControlProps, 'asChild' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `clearLabel` | `string` | — |  |
| `indicator` | `Snippet` | — |  |
| `placeholder` | `string` | — |  |

### `SelectItem` — `SelectItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `T` | — |  |
| `persistFocus` | `boolean` | — |  |

### `SelectItemGroup` — `SelectItemGroupProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | — |  |

### `SelectOption` — `SelectOptionProps`
adds to `Omit<SelectItemProps<T>, 'asChild'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `T` | — | from `SelectItemProps` |
| `persistFocus` | `boolean` | — | from `SelectItemProps` |
| `indicator` | `Snippet \| false` | — | Replaces the default check indicator; `false` renders no indicator. |

### `SelectRootProvider` — `SelectRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `SelectApi<T>` | — |  |

### `SelectValueText` — `SelectValueTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `placeholder` | `string` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Select` | `select` | `root` | `select-root` |
| `SelectClearTrigger` | `select` | `clear-trigger` | `select-clear-trigger` |
| `SelectContent` | `select` | `content` | `select-content` |
| `SelectControl` | `select` | `control` | `select-control` |
| `SelectHiddenSelect` | `select` | `hidden-select` | `—` |
| `SelectIndicator` | `select` | `indicator` | `select-indicator` |
| `SelectItem` | `select` | `item` | `select-item` |
| `SelectItemGroup` | `select` | `item-group` | `select-item-group` |
| `SelectItemGroupLabel` | `select` | `item-group-label` | `select-item-group-label` |
| `SelectItemIndicator` | `select` | `item-indicator` | `select-item-indicator` |
| `SelectItemText` | `select` | `item-text` | `select-item-text` |
| `SelectLabel` | `select` | `label` | `select-label` |
| `SelectList` | `select` | `list` | `select-list` |
| `SelectPositioner` | `select` | `positioner` | `select-positioner` |
| `SelectRootProvider` | `select` | `root` | `select-root-provider` |
| `SelectTrigger` | `select` | `trigger` | `select-trigger` |
| `SelectValueText` | `select` | `value-text` | `select-value-text` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-select-action-size` | `var(--moduix-size-xs)` |
| `--moduix-select-content-max-height` | `24rem` |
| `--moduix-select-control-height` | `var(--moduix-size-md)` |
| `--moduix-select-radius` | `var(--moduix-radius-md)` |
| `--moduix-select-width` | `14rem` |

## Keyboard

Keys handled by this family: `End`, `Enter`, `Escape`, `Home`, `Space`, `Tab`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `select:${id}`
- `select:${id}:clear-trigger`
- `select:${id}:content`
- `select:${id}:control`
- `select:${id}:label`
- `select:${id}:optgroup-label:${id}`
- `select:${id}:optgroup:${id}`
- `select:${id}:option:${id}`
- `select:${id}:positioner`
- `select:${id}:select`
- `select:${id}:trigger`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Select,
		SelectContent,
		SelectField,
		SelectHiddenSelect,
		SelectItemGroup,
		SelectItemGroupLabel,
		SelectLabel,
		SelectList,
		SelectOption,
		SelectPositioner
	} from 'rta-ui';

	const groups = [
		{
			id: 'fruits',
			label: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana' },
				{ value: 'cherry', label: 'Cherry' }
			]
		},
		{
			id: 'vegetables',
			label: 'Vegetables',
			items: [
				{ value: 'carrot', label: 'Carrot' },
				{ value: 'daikon', label: 'Daikon' }
			]
		}
	];

	const items = groups.flatMap((group) => group.items);
</script>

<Select {items} name="produce" defaultValue={['apple']}>
	<SelectLabel>Produce</SelectLabel>
	<SelectField placeholder="Pick a produce" clearLabel="Clear selection" />
	<SelectHiddenSelect />
	<SelectPositioner>
		<SelectContent>
			<SelectList>
				{#each groups as group (group.id)}
					<SelectItemGroup id={group.id}>
						<SelectItemGroupLabel>{group.label}</SelectItemGroupLabel>
						{#each group.items as item (item.value)}
							<SelectOption {item}>{item.label}</SelectOption>
						{/each}
					</SelectItemGroup>
				{/each}
			</SelectList>
		</SelectContent>
	</SelectPositioner>
</Select>
```

## Behaviour covered by tests

- renders the closed anatomy with trigger, control and hidden select hooks
- opens on trigger click and reports the open state
- selects an item, mirrors it into the hidden select and closes
- keeps the menu open and accumulates values when multiple
- opens from the keyboard, roves the highlight and selects with Enter
- typeahead selects through the closed trigger and Escape closes the menu
- composes the field shorthand with a clear trigger
- clears the value from the clear trigger and deselects the selected item
- portals the positioner, dismisses outside and unmounts it on close

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
