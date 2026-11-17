---
title: Menu
component: menu
description: Open a list of actions or options from a button or a right click.
---

# Menu

Open a list of actions or options from a button or a right click.

Port of `moduix/packages/svelte/src/components/menu` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Menu` | `Menu.svelte` |
| `MenuArrow` | `MenuArrow.svelte` |
| `MenuArrowTip` | `MenuArrowTip.svelte` |
| `MenuCheckboxItem` | `MenuCheckboxItem.svelte` |
| `MenuContent` | `MenuContent.svelte` |
| `MenuContextTrigger` | `MenuContextTrigger.svelte` |
| `MenuIndicator` | `MenuIndicator.svelte` |
| `MenuItem` | `MenuItem.svelte` |
| `MenuItemGroup` | `MenuItemGroup.svelte` |
| `MenuItemGroupLabel` | `MenuItemGroupLabel.svelte` |
| `MenuItemIndicator` | `MenuItemIndicator.svelte` |
| `MenuItemShortcut` | `MenuItemShortcut.svelte` |
| `MenuItemText` | `MenuItemText.svelte` |
| `MenuPositioner` | `MenuPositioner.svelte` |
| `MenuRadioItem` | `MenuRadioItem.svelte` |
| `MenuRadioItemGroup` | `MenuRadioItemGroup.svelte` |
| `MenuRootProvider` | `MenuRootProvider.svelte` |
| `MenuSeparator` | `MenuSeparator.svelte` |
| `MenuTrigger` | `MenuTrigger.svelte` |
| `MenuTriggerItem` | `MenuTriggerItem.svelte` |
| `MenuTriggerItemIcon` | `MenuTriggerItemIcon.svelte` |
| `MenuViewport` | `MenuViewport.svelte` |

`Menu`, `MenuRootProvider` render no element of their own: they create the state and provide it to the other parts.

## Props

### `Menu` — `MenuRootProps`
adds to `UseMenuProps`, `MenuPortalOptions`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | from `UseMenuProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | `undefined` | from `UseMenuProps` |
| `open` | `boolean` | — | bindable from `UseMenuProps` |
| `defaultOpen` | `boolean` | `undefined` | from `UseMenuProps` |
| `highlightedValue` | `string \| null` | — | bindable from `UseMenuProps` |
| `defaultHighlightedValue` | `string \| null` | `undefined` | from `UseMenuProps` |
| `triggerValue` | `string \| null` | — | bindable from `UseMenuProps` |
| `defaultTriggerValue` | `string \| null` | `undefined` | from `UseMenuProps` |
| `anchorPoint` | `MenuPoint \| null` | `undefined` | from `UseMenuProps` |
| `closeOnSelect` | `boolean` | `undefined` | from `UseMenuProps` |
| `closeOnEscape` | `boolean` | `undefined` | from `UseMenuProps` |
| `composite` | `boolean` | `undefined` | from `UseMenuProps` |
| `loopFocus` | `boolean` | `undefined` | from `UseMenuProps` |
| `typeahead` | `boolean` | `undefined` | from `UseMenuProps` |
| `positioning` | `PositionOptions` | `undefined` | from `UseMenuProps` |
| `portalled` | `boolean` | `true` | from `UseMenuProps` |
| `portalRef` | `HTMLElement \| null` | `undefined` | from `UseMenuProps` |
| `lazyMount` | `boolean` | `true` | from `UseMenuProps` |
| `unmountOnExit` | `boolean` | `true` | from `UseMenuProps` |
| `aria-label` | `string` | — | from `UseMenuProps` |
| `initialFocusEl` | `() => HTMLElement \| null \| undefined` | `undefined` | from `UseMenuProps` |
| `finalFocusEl` | `() => HTMLElement \| null \| undefined` | `undefined` | from `UseMenuProps` |
| `navigate` | `(details: MenuNavigateDetails) => void` | `undefined` | from `UseMenuProps` |
| `onOpenChange` | `(details: MenuOpenChangeDetails) => void` | `undefined` | from `UseMenuProps` |
| `onHighlightChange` | `(details: MenuHighlightChangeDetails) => void` | `undefined` | from `UseMenuProps` |
| `onTriggerValueChange` | `(details: MenuTriggerValueChangeDetails) => void` | `undefined` | from `UseMenuProps` |
| `onSelect` | `(details: MenuSelectionDetails) => void` | `undefined` | from `UseMenuProps` |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | `undefined` | from `UseMenuProps` |
| `onPointerDownOutside` | `(event: MenuPointerDownOutsideEvent) => void` | `undefined` | from `UseMenuProps` |
| `onFocusOutside` | `(event: MenuFocusOutsideEvent) => void` | `undefined` | from `UseMenuProps` |
| `onInteractOutside` | `(event: MenuInteractOutsideEvent) => void` | `undefined` | from `UseMenuProps` |
| `onRequestDismiss` | `(event: Event) => void` | `undefined` | from `UseMenuProps` |
| `children` | `Snippet` | — |  |

### `MenuCheckboxItem` — `MenuCheckboxItemProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'value'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `valueText` | `string` | `undefined` |  |
| `disabled` | `boolean` | `false` |  |
| `closeOnSelect` | `boolean` | `undefined` |  |
| `checked` | `boolean` | — | bindable |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` |  |
| `indicator` | `MenuIndicatorPosition` | `'start'` | Where the check indicator sits relative to the label. |

### `MenuContextTrigger` — `MenuContextTriggerProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `null` |  |

### `MenuItem` — `MenuItemProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'value'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `valueText` | `string` | `undefined` |  |
| `disabled` | `boolean` | `false` |  |
| `closeOnSelect` | `boolean` | `undefined` |  |
| `onSelect` | `() => void` | `undefined` |  |
| `tone` | `MenuItemTone` | `'default'` | Visual intent of the item. |

### `MenuItemGroup` — `MenuItemGroupProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` |  |

### `MenuItemGroupLabel` — `MenuItemGroupLabelProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `htmlFor` | `string` | `''` |  |

### `MenuRadioItem` — `MenuRadioItemProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'value'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `valueText` | `string` | `undefined` |  |
| `disabled` | `boolean` | `false` |  |
| `closeOnSelect` | `boolean` | `undefined` |  |
| `indicator` | `MenuIndicatorPosition` | `'start'` | Where the radio indicator sits relative to the label. |

### `MenuRadioItemGroup` — `MenuRadioItemGroupProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` |  |
| `value` | `string \| null` | — | bindable |
| `defaultValue` | `string \| null` | `null` |  |
| `onValueChange` | `(details: MenuValueChangeDetails) => void` | `undefined` |  |

### `MenuRootProvider` — `MenuRootProviderProps`
adds to `MenuPortalOptions`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `portalled` | `boolean` | `true` | from `MenuPortalOptions` |
| `value` | `MenuApi` | — |  |
| `portalRef` | `HTMLElement \| null` | `undefined` |  |
| `children` | `Snippet` | — |  |

### `MenuTrigger` — `MenuTriggerProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `undefined` | Scopes a trigger to one value when several triggers drive the same menu. |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `MenuArrow` | `—` | `—` | `menu-arrow` |
| `MenuArrowTip` | `—` | `—` | `menu-arrow-tip` |
| `MenuCheckboxItem` | `—` | `—` | `menu-checkbox-item` |
| `MenuContent` | `—` | `—` | `menu-content` |
| `MenuContextTrigger` | `—` | `—` | `menu-context-trigger` |
| `MenuIndicator` | `—` | `—` | `menu-indicator` |
| `MenuItem` | `—` | `—` | `menu-item` |
| `MenuItemGroup` | `—` | `—` | `menu-item-group` |
| `MenuItemGroupLabel` | `—` | `—` | `menu-item-group-label` |
| `MenuItemIndicator` | `—` | `—` | `menu-item-indicator` |
| `MenuItemShortcut` | `—` | `—` | `menu-item-shortcut` |
| `MenuItemText` | `—` | `—` | `menu-item-text` |
| `MenuPositioner` | `—` | `arrow` | `menu-positioner` |
| `MenuRadioItem` | `—` | `—` | `menu-radio-item` |
| `MenuRadioItemGroup` | `—` | `—` | `menu-radio-item-group` |
| `MenuSeparator` | `—` | `—` | `menu-separator` |
| `MenuTrigger` | `—` | `—` | `menu-trigger` |
| `MenuTriggerItem` | `—` | `—` | `menu-trigger-item` |
| `MenuTriggerItemIcon` | `—` | `—` | `menu-trigger-item-icon` |
| `MenuViewport` | `menu` | `viewport` | `menu-viewport` |

Custom properties read by this family’s CSS Module:

- `--moduix-menu-popup-max-height`
- `--moduix-menu-popup-max-width`
- `--moduix-menu-popup-min-width`

## Generated ids

- `menu:${id}:arrow`
- `menu:${id}:content`
- `menu:${id}:ctx-trigger`
- `menu:${id}:ctx-trigger:${id}`
- `menu:${id}:group-label:${id}`
- `menu:${id}:group:${id}`
- `menu:${id}:popper`
- `menu:${id}:trigger`
- `menu:${id}:trigger:${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		Menu,
		MenuArrow,
		MenuCheckboxItem,
		MenuContent,
		MenuIndicator,
		MenuItem,
		MenuItemGroup,
		MenuItemGroupLabel,
		MenuItemIndicator,
		MenuItemShortcut,
		MenuItemText,
		MenuPositioner,
		MenuRadioItem,
		MenuRadioItemGroup,
		MenuSeparator,
		MenuTrigger,
		MenuViewport
	} from 'rta-ui';

	let wrap = $state(true);
	let density = $state('compact');
</script>

<Menu>
	<MenuTrigger>
		Actions
		<MenuIndicator />
	</MenuTrigger>
	<MenuPositioner>
		<MenuContent>
			<MenuArrow />
			<MenuViewport>
				<MenuItemGroup id="edit">
					<MenuItemGroupLabel htmlFor="edit">Edit</MenuItemGroupLabel>
					<MenuItem value="undo">
						<MenuItemText>Undo</MenuItemText>
						<MenuItemShortcut>⌘Z</MenuItemShortcut>
					</MenuItem>
					<MenuItem value="redo" disabled>
						<MenuItemText>Redo</MenuItemText>
					</MenuItem>
				</MenuItemGroup>
				<MenuSeparator />
				<MenuCheckboxItem value="wrap" bind:checked={wrap}>
					<MenuItemIndicator />
					<MenuItemText>Word wrap</MenuItemText>
				</MenuCheckboxItem>
				<MenuRadioItemGroup value={density} onValueChange={(details) => (density = details.value ?? 'compact')}>
					<MenuRadioItem value="compact">
						<MenuItemIndicator />
						<MenuItemText>Compact</MenuItemText>
					</MenuRadioItem>
					<MenuRadioItem value="comfortable">
						<MenuItemIndicator />
						<MenuItemText>Comfortable</MenuItemText>
					</MenuRadioItem>
				</MenuRadioItemGroup>
				<MenuSeparator />
				<MenuItem value="delete" tone="destructive">
					<MenuItemText>Delete</MenuItemText>
				</MenuItem>
			</MenuViewport>
		</MenuContent>
	</MenuPositioner>
</Menu>
```

## Behaviour covered by tests

- renders the Zag trigger contract and keeps closed content unmounted
- opens on click with Zag ids, roles and grouped items
- ArrowDown opens and highlights, arrows and Home/End move, aria-activedescendant follows
- typeahead highlights by label and cycles repeated characters
- hovering an item highlights it
- Enter selects the highlighted item, closes the menu and restores focus
- closeOnSelect={false} keeps the menu open after a click
- disabled items never select, and pointer or focus outside dismisses
- focus moving outside dismisses the menu
- Escape closes without selecting
- checkbox and radio items report checked state
- the submenu trigger item opens its own menu on ArrowRight
- the context trigger opens on contextmenu and positions from the pointer

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
