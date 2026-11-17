---
title: Listbox
component: listbox
description: Show a visible list of options for picking one or many.
---

# Listbox

Show a visible list of options for picking one or many.

Port of `moduix/packages/svelte/src/components/listbox` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Listbox` | `Listbox.svelte` |
| `ListboxClearTrigger` | `ListboxClearTrigger.svelte` |
| `ListboxContent` | `ListboxContent.svelte` |
| `ListboxEmpty` | `ListboxEmpty.svelte` |
| `ListboxFilter` | `ListboxFilter.svelte` |
| `ListboxInput` | `ListboxInput.svelte` |
| `ListboxItem` | `ListboxItem.svelte` |
| `ListboxItemGroup` | `ListboxItemGroup.svelte` |
| `ListboxItemGroupLabel` | `ListboxItemGroupLabel.svelte` |
| `ListboxItemIndicator` | `ListboxItemIndicator.svelte` |
| `ListboxItemText` | `ListboxItemText.svelte` |
| `ListboxLabel` | `ListboxLabel.svelte` |
| `ListboxRootProvider` | `ListboxRootProvider.svelte` |
| `ListboxValueText` | `ListboxValueText.svelte` |

## Props

### `ListboxItem` — `ListboxItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `T` | — |  |
| `highlightOnHover` | `boolean` | — |  |

### `ListboxItemGroup` — `ListboxItemGroupProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | — |  |

### `ListboxRootProvider` — `ListboxRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `ListboxApi<T>` | — |  |

### `ListboxValueText` — `ListboxValueTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `placeholder` | `string` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Listbox` | `listbox` | `root` | `listbox-root` |
| `ListboxClearTrigger` | `listbox` | `clear-trigger` | `listbox-clear-trigger` |
| `ListboxContent` | `listbox` | `content` | `listbox-content` |
| `ListboxEmpty` | `listbox` | `empty` | `listbox-empty` |
| `ListboxFilter` | `—` | `—` | `listbox-filter` |
| `ListboxInput` | `listbox` | `input` | `listbox-input` |
| `ListboxItem` | `listbox` | `item` | `listbox-item` |
| `ListboxItemGroup` | `listbox` | `item-group` | `listbox-item-group` |
| `ListboxItemGroupLabel` | `listbox` | `item-group-label` | `listbox-item-group-label` |
| `ListboxItemIndicator` | `listbox` | `item-indicator` | `listbox-item-indicator` |
| `ListboxItemText` | `listbox` | `item-text` | `listbox-item-text` |
| `ListboxLabel` | `listbox` | `label` | `listbox-label` |
| `ListboxRootProvider` | `listbox` | `root` | `listbox-root-provider` |
| `ListboxValueText` | `listbox` | `value-text` | `listbox-value-text` |

Custom properties read by this family’s CSS Module:

- `--moduix-listbox-content-max-height`
- `--moduix-listbox-width`

## Generated ids

- `listbox:${id}`
- `listbox:${id}:content`
- `listbox:${id}:item-group-label:${id}`
- `listbox:${id}:item-group:${id}`
- `listbox:${id}:item:${id}`
- `listbox:${id}:label`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		Listbox,
		ListboxContent,
		ListboxEmpty,
		ListboxFilter,
		ListboxInput,
		ListboxItem,
		ListboxItemGroup,
		ListboxItemGroupLabel,
		ListboxItemIndicator,
		ListboxItemText,
		ListboxLabel,
		ListboxValueText
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

<Listbox {items} defaultValue={['banana']} selectionMode="multiple">
	<ListboxLabel>Produce</ListboxLabel>
	<ListboxFilter>
		<ListboxInput placeholder="Search produce" />
	</ListboxFilter>
	<ListboxContent>
		<ListboxEmpty>Nothing matches.</ListboxEmpty>
		{#each groups as group (group.id)}
			<ListboxItemGroup id={group.id}>
				<ListboxItemGroupLabel>{group.label}</ListboxItemGroupLabel>
				{#each group.items as item (item.value)}
					<ListboxItem {item} highlightOnHover>
						<ListboxItemText>{item.label}</ListboxItemText>
						<ListboxItemIndicator />
					</ListboxItem>
				{/each}
			</ListboxItemGroup>
		{/each}
	</ListboxContent>
	<ListboxValueText placeholder="None selected" />
</Listbox>
```

## Behaviour covered by tests

- renders the anatomy with moduix slots and Zag ids
- selects a single item on click and reports items
- roves the highlight from the keyboard and selects with Enter
- typeahead highlights matches, cycles repeats and skips disabled items
- supports multiple selection with aria-multiselectable and ctrl+a
- ignores pointer interaction with a disabled item
- renders the empty part only for an empty collection
- clears the search input from the clear trigger

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
