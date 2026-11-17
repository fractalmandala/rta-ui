---
title: Combobox
component: combobox
description: Type to filter a list and pick one or more values.
---

# Combobox

Type to filter a list and pick one or more values.

Port of `moduix/packages/svelte/src/components/combobox` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Combobox` | `Combobox.svelte` |
| `ComboboxClearTrigger` | `ComboboxClearTrigger.svelte` |
| `ComboboxContent` | `ComboboxContent.svelte` |
| `ComboboxControl` | `ComboboxControl.svelte` |
| `ComboboxEmpty` | `ComboboxEmpty.svelte` |
| `ComboboxInput` | `ComboboxInput.svelte` |
| `ComboboxItem` | `ComboboxItem.svelte` |
| `ComboboxItemGroup` | `ComboboxItemGroup.svelte` |
| `ComboboxItemGroupLabel` | `ComboboxItemGroupLabel.svelte` |
| `ComboboxItemIndicator` | `ComboboxItemIndicator.svelte` |
| `ComboboxItemText` | `ComboboxItemText.svelte` |
| `ComboboxLabel` | `ComboboxLabel.svelte` |
| `ComboboxList` | `ComboboxList.svelte` |
| `ComboboxOption` | `ComboboxOption.svelte` |
| `ComboboxPositioner` | `ComboboxPositioner.svelte` |
| `ComboboxRootProvider` | `ComboboxRootProvider.svelte` |
| `ComboboxStatus` | `ComboboxStatus.svelte` |
| `ComboboxTrigger` | `ComboboxTrigger.svelte` |

## Props

### `Combobox` — `ComboboxRootProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id' | 'onSelect' | 'placeholder'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseComboboxProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `items` | `ComboboxEntry[]` | — | from `UseComboboxProps` |
| `itemToValue` | `(item: ComboboxEntry) => string` | — | from `UseComboboxProps` |
| `itemToString` | `(item: ComboboxEntry) => string` | — | from `UseComboboxProps` |
| `isItemDisabled` | `(item: ComboboxEntry) => boolean` | — | from `UseComboboxProps` |
| `value` | `string[]` | — | bindable from `UseComboboxProps` |
| `defaultValue` | `string[]` | — | from `UseComboboxProps` |
| `onValueChange` | `(details: ComboboxValueChangeDetails) => void` | — | from `UseComboboxProps` |
| `onSelect` | `(details: ComboboxSelectionDetails) => void` | — | from `UseComboboxProps` |
| `inputValue` | `string` | — | bindable from `UseComboboxProps` |
| `defaultInputValue` | `string` | — | from `UseComboboxProps` |
| `onInputValueChange` | `(details: ComboboxInputValueChangeDetails) => void` | — | from `UseComboboxProps` |
| `highlightedValue` | `string \| null` | — | bindable from `UseComboboxProps` |
| `defaultHighlightedValue` | `string \| null` | — | from `UseComboboxProps` |
| `onHighlightChange` | `(details: ComboboxHighlightChangeDetails) => void` | — | from `UseComboboxProps` |
| `open` | `boolean` | — | bindable from `UseComboboxProps` |
| `defaultOpen` | `boolean` | — | from `UseComboboxProps` |
| `onOpenChange` | `(details: ComboboxOpenChangeDetails) => void` | — | from `UseComboboxProps` |
| `multiple` | `boolean` | — | from `UseComboboxProps` |
| `disabled` | `boolean` | — | from `UseComboboxProps` |
| `readOnly` | `boolean` | — | from `UseComboboxProps` |
| `required` | `boolean` | — | from `UseComboboxProps` |
| `invalid` | `boolean` | — | from `UseComboboxProps` |
| `name` | `string` | — | from `UseComboboxProps` |
| `form` | `string` | — | from `UseComboboxProps` |
| `placeholder` | `string` | — | from `UseComboboxProps` |
| `autoFocus` | `boolean` | — | from `UseComboboxProps` |
| `loading` | `boolean` | — | from `UseComboboxProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseComboboxProps` |
| `id` | `string \| null` | — | from `UseComboboxProps` |
| `ids` | `ComboboxElementIds` | — | from `UseComboboxProps` |
| `loopFocus` | `boolean` | — | from `UseComboboxProps` |
| `openOnClick` | `boolean` | — | from `UseComboboxProps` |
| `openOnFocus` | `boolean` | — | from `UseComboboxProps` |
| `openOnChange` | `boolean \| ((details: ComboboxInputValueChangeDetails) => boolean)` | — | from `UseComboboxProps` |
| `openOnKeyPress` | `boolean` | — | from `UseComboboxProps` |
| `closeOnSelect` | `boolean` | — | from `UseComboboxProps` |
| `closeOnEscape` | `boolean` | — | from `UseComboboxProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseComboboxProps` |
| `disableLayer` | `boolean` | — | from `UseComboboxProps` |
| `allowCustomValue` | `boolean` | — | from `UseComboboxProps` |
| `alwaysSubmitOnEnter` | `boolean` | — | from `UseComboboxProps` |
| `composite` | `boolean` | — | from `UseComboboxProps` |
| `inputBehavior` | `ComboboxInputBehavior` | — | from `UseComboboxProps` |
| `selectionBehavior` | `ComboboxSelectionBehavior` | — | from `UseComboboxProps` |
| `portalled` | `boolean` | — | from `UseComboboxProps` |
| `portalRef` | `Element \| (() => Element \| null \| undefined) \| null` | — | from `UseComboboxProps` |
| `lazyMount` | `boolean` | — | from `UseComboboxProps` |
| `unmountOnExit` | `boolean` | — | from `UseComboboxProps` |
| `positioning` | `ComboboxPositioningOptions` | — | from `UseComboboxProps` |
| `translations` | `Partial<ComboboxTranslations>` | — | from `UseComboboxProps` |
| `onFocusOutside` | `(event: InteractOutsideEvent) => void` | — | from `UseComboboxProps` |
| `onPointerDownOutside` | `(event: InteractOutsideEvent) => void` | — | from `UseComboboxProps` |
| `onInteractOutside` | `(event: InteractOutsideEvent) => void` | — | from `UseComboboxProps` |

### `ComboboxItem` — `ComboboxItemProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'item'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `ComboboxEntry` | — |  |
| `persistFocus` | `boolean` | — |  |

### `ComboboxItemGroup` — `ComboboxItemGroupProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | — |  |

### `ComboboxItemGroupLabel` — `ComboboxItemGroupLabelProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — |  |

### `ComboboxOption` — `ComboboxOptionProps`
adds to `Omit<ComboboxItemProps, 'asChild'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `ComboboxEntry` | — | from `ComboboxItemProps` |
| `persistFocus` | `boolean` | — | from `ComboboxItemProps` |
| `indicator` | `Snippet \| false` | — | Replaces the default check indicator; `false` renders no indicator. |

### `ComboboxRootProvider` — `ComboboxRootProviderProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `ComboboxApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Combobox` | `combobox` | `root` | `combobox-root` |
| `ComboboxClearTrigger` | `combobox` | `clear-trigger` | `combobox-clear-trigger` |
| `ComboboxContent` | `combobox` | `content` | `combobox-content` |
| `ComboboxControl` | `combobox` | `control` | `combobox-control` |
| `ComboboxEmpty` | `combobox` | `empty` | `combobox-empty` |
| `ComboboxInput` | `combobox` | `input` | `combobox-input` |
| `ComboboxItem` | `combobox` | `item` | `combobox-item` |
| `ComboboxItemGroup` | `combobox` | `item-group` | `combobox-item-group` |
| `ComboboxItemGroupLabel` | `combobox` | `item-group-label` | `combobox-item-group-label` |
| `ComboboxItemIndicator` | `combobox` | `item-indicator` | `combobox-item-indicator` |
| `ComboboxItemText` | `combobox` | `item-text` | `combobox-item-text` |
| `ComboboxLabel` | `combobox` | `label` | `combobox-label` |
| `ComboboxList` | `combobox` | `list` | `combobox-list` |
| `ComboboxPositioner` | `combobox` | `positioner` | `combobox-positioner` |
| `ComboboxRootProvider` | `combobox` | `root` | `combobox-root-provider` |
| `ComboboxStatus` | `combobox` | `—` | `combobox-status` |
| `ComboboxTrigger` | `combobox` | `trigger` | `combobox-trigger` |

Custom properties read by this family’s CSS Module:

- `--moduix-combobox-action-size`
- `--moduix-combobox-content-max-height`
- `--moduix-combobox-control-height`
- `--moduix-combobox-radius`
- `--moduix-combobox-width`

## Generated ids

- `combobox:${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		Combobox,
		ComboboxClearTrigger,
		ComboboxContent,
		ComboboxControl,
		ComboboxEmpty,
		ComboboxInput,
		ComboboxItemGroup,
		ComboboxItemGroupLabel,
		ComboboxLabel,
		ComboboxList,
		ComboboxOption,
		ComboboxPositioner,
		ComboboxTrigger,
		type ComboboxEntry
	} from 'rta-ui';

	const fruits: ComboboxEntry[] = [
		{ value: 'apple', label: 'Apple', group: 'Orchard' },
		{ value: 'banana', label: 'Banana', group: 'Tropical' },
		{ value: 'mango', label: 'Mango', group: 'Tropical' },
		{ value: 'papaya', label: 'Papaya', group: 'Tropical' },
		{ value: 'pear', label: 'Pear', group: 'Orchard' }
	];

	let query = $state('');
	let multiQuery = $state('');
	let value = $state<string[]>([]);
	let multiValue = $state<string[]>(['mango']);

	const matches = (item: ComboboxEntry, value: string) =>
		String(item.label ?? item.value)
			.toLowerCase()
			.includes(value.toLowerCase());

	const filtered = $derived(query ? fruits.filter((item) => matches(item, query)) : fruits);

	const grouped = $derived(
		filtered.reduce<Record<string, ComboboxEntry[]>>((acc, item) => {
			const key = String(item.group ?? 'Other');
			(acc[key] ??= []).push(item);
			return acc;
		}, {})
	);

	const multiFiltered = $derived(multiQuery ? fruits.filter((item) => matches(item, multiQuery)) : fruits);
	const selected = $derived(fruits.filter((item) => multiValue.includes(item.value)));
</script>

<Combobox
	bind:value
	items={filtered}
	onInputValueChange={(details) => (query = details.inputValue)}
>
	<ComboboxLabel>Fruit</ComboboxLabel>
	<ComboboxControl>
		<ComboboxInput placeholder="e.g. Mango" />
		<ComboboxClearTrigger />
		<ComboboxTrigger />
	</ComboboxControl>
	<ComboboxPositioner>
		<ComboboxContent>
			<ComboboxEmpty>No fruits found.</ComboboxEmpty>
			{#each Object.entries(grouped) as [group, entries] (group)}
				<ComboboxItemGroup id={group}>
					<ComboboxItemGroupLabel>{group}</ComboboxItemGroupLabel>
					{#each entries as item (item.value)}
						<ComboboxOption {item}>{item.label}</ComboboxOption>
					{/each}
				</ComboboxItemGroup>
			{/each}
		</ComboboxContent>
	</ComboboxPositioner>
</Combobox>

<Combobox
	bind:value={multiValue}
	items={fruits}
	multiple
	onInputValueChange={(details) => (multiQuery = details.inputValue)}
>
	<ComboboxLabel>Fruits</ComboboxLabel>
	<p>
		{#if selected.length === 0}
			None selected
		{:else}
			{#each selected as item (item.value)}
				<span>{item.label}{' '}</span>
			{/each}
		{/if}
	</p>
	<ComboboxControl>
		<ComboboxInput placeholder="Search fruits" />
		<ComboboxTrigger />
	</ComboboxControl>
	<ComboboxPositioner>
		<ComboboxContent>
			<ComboboxEmpty>No fruits found.</ComboboxEmpty>
			<ComboboxList>
				{#each multiFiltered as item (item.value)}
					<ComboboxOption {item}>{item.label}</ComboboxOption>
				{/each}
			</ComboboxList>
		</ComboboxContent>
	</ComboboxPositioner>
</Combobox>
```

## Behaviour covered by tests

- emits the Zag anatomy hooks and the combobox aria contract
- opens on input, click and focus, portals the content and dismisses outside
- narrows items through onInputValueChange and renders the empty state
- navigates with arrows, Home and End, then selects with Enter or Space
- closes on Escape, reverts custom input, and commits it with allowCustomValue
- selects several items, submits hidden inputs and removes a chip
- groups items with the Zag optgroup id scheme and types ahead when the list is static
- drives createCombobox defaults and a controlled value through RootProvider

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
