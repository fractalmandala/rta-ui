---
title: CommandPalette
component: command-palette
description: Search and run commands from a dialog opened by a button or shortcut.
---

# CommandPalette

Search and run commands from a dialog opened by a button or shortcut.

Port of `moduix/packages/svelte/src/components/command-palette` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { CommandPalette } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `CommandPalette` | `CommandPalette.svelte` | `—` |
| `CommandPaletteBackdrop` | `CommandPaletteBackdrop.svelte` | `—` |
| `CommandPaletteClearTrigger` | `CommandPaletteClearTrigger.svelte` | `none (aria-hidden)` |
| `CommandPaletteCombobox` | `CommandPaletteCombobox.svelte` | `—` |
| `CommandPaletteContent` | `CommandPaletteContent.svelte` | `listbox` |
| `CommandPaletteControl` | `CommandPaletteControl.svelte` | `—` |
| `CommandPaletteDescription` | `CommandPaletteDescription.svelte` | `—` |
| `CommandPaletteEmpty` | `CommandPaletteEmpty.svelte` | `presentation` |
| `CommandPaletteFooter` | `CommandPaletteFooter.svelte` | `—` |
| `CommandPaletteHeader` | `CommandPaletteHeader.svelte` | `—` |
| `CommandPaletteInput` | `CommandPaletteInput.svelte` | `combobox` |
| `CommandPaletteItem` | `CommandPaletteItem.svelte` | `option` |
| `CommandPaletteItemDescription` | `CommandPaletteItemDescription.svelte` | `—` |
| `CommandPaletteItemGroup` | `CommandPaletteItemGroup.svelte` | `group` |
| `CommandPaletteItemGroupLabel` | `CommandPaletteItemGroupLabel.svelte` | `presentation` |
| `CommandPaletteItemIcon` | `CommandPaletteItemIcon.svelte` | `—` |
| `CommandPaletteItemIndicator` | `CommandPaletteItemIndicator.svelte` | `none (aria-hidden)` |
| `CommandPaletteItemLabel` | `CommandPaletteItemLabel.svelte` | `—` |
| `CommandPaletteItemMeta` | `CommandPaletteItemMeta.svelte` | `—` |
| `CommandPaletteItemText` | `CommandPaletteItemText.svelte` | `—` |
| `CommandPaletteKbd` | `CommandPaletteKbd.svelte` | `—` |
| `CommandPaletteList` | `CommandPaletteList.svelte` | `—` |
| `CommandPalettePanel` | `CommandPalettePanel.svelte` | `—` |
| `CommandPalettePositioner` | `CommandPalettePositioner.svelte` | `—` |
| `CommandPaletteRootProvider` | `CommandPaletteRootProvider.svelte` | `—` |
| `CommandPaletteSearch` | `CommandPaletteSearch.svelte` | `none (aria-hidden)` |
| `CommandPaletteSeparator` | `CommandPaletteSeparator.svelte` | `separator` |
| `CommandPaletteTitle` | `CommandPaletteTitle.svelte` | `—` |
| `CommandPaletteTrigger` | `CommandPaletteTrigger.svelte` | `—` |

`CommandPalette`, `CommandPaletteRootProvider` render no element of their own: they create the state and provide it to the other parts.

ARIA roles rendered by this family: `combobox`, `dialog`, `group`, `listbox`, `option`, `presentation`, `separator`.

## Props

### `CommandPalette` — `CommandPaletteRootProps`
adds to `UseCommandPaletteProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `open` | `boolean` | — | bindable from `UseCommandPaletteProps` |
| `defaultOpen` | `boolean` | — | from `UseCommandPaletteProps` |
| `onOpenChange` | `(details: CommandPaletteOpenChangeDetails) => void` | — | from `UseCommandPaletteProps` |
| `modal` | `boolean` | — | from `UseCommandPaletteProps` |
| `trapFocus` | `boolean` | — | from `UseCommandPaletteProps` |
| `preventScroll` | `boolean` | — | from `UseCommandPaletteProps` |
| `restoreFocus` | `boolean` | — | from `UseCommandPaletteProps` |
| `closeOnEscape` | `boolean` | — | from `UseCommandPaletteProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseCommandPaletteProps` |
| `aria-label` | `string` | — | from `UseCommandPaletteProps` |
| `initialFocusEl` | `() => Element \| null \| undefined \| false` | — | from `UseCommandPaletteProps` |
| `finalFocusEl` | `() => Element \| null \| undefined` | — | from `UseCommandPaletteProps` |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | from `UseCommandPaletteProps` |
| `onFocusOutside` | `(event: CommandPaletteFocusOutsideEvent) => void` | — | from `UseCommandPaletteProps` |
| `onInteractOutside` | `(event: CommandPaletteInteractOutsideEvent) => void` | — | from `UseCommandPaletteProps` |
| `onPointerDownOutside` | `(event: CommandPalettePointerDownOutsideEvent) => void` | — | from `UseCommandPaletteProps` |
| `persistentElements` | `(() => Element \| null \| undefined)[]` | — | from `UseCommandPaletteProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseCommandPaletteProps` |
| `id` | `string \| null` | — | from `UseCommandPaletteProps` |
| `ids` | `CommandPaletteElementIds` | — | from `UseCommandPaletteProps` |
| `lazyMount` | `boolean` | `true` | from `UseCommandPaletteProps` |
| `unmountOnExit` | `boolean` | `true` | from `UseCommandPaletteProps` |
| `onExitComplete` | `() => void` | — | from `UseCommandPaletteProps` |
| `portalled` | `boolean` | `true` | Render the overlay inside `document.body`. Set `false` to keep it in place. from `UseCommandPaletteProps` |
| `portalRef` | `CommandPalettePortalTarget` | — | Element or getter for the portal container. from `UseCommandPaletteProps` |
| `shortcut` | `false \| string` | `false` | Global hotkey that toggles the palette, such as `mod+k`. `false` disables it. from `UseCommandPaletteProps` |
| `children` | `Snippet` | — |  |

### `CommandPaletteCombobox` — `CommandPaletteComboboxProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id' | 'dir' | 'onSelect' | 'placeholder' | 'children'>`, `PolymorphicProps<'div'>`, `RefAttribute<HTMLDivElement>`, and adds to `UseCommandPaletteComboboxProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `items` | `CommandPaletteEntry[]` | `[]` | from `UseCommandPaletteComboboxProps` |
| `itemToValue` | `(item: CommandPaletteEntry) => string` | — | from `UseCommandPaletteComboboxProps` |
| `itemToString` | `(item: CommandPaletteEntry) => string` | — | from `UseCommandPaletteComboboxProps` |
| `isItemDisabled` | `(item: CommandPaletteEntry) => boolean` | — | from `UseCommandPaletteComboboxProps` |
| `value` | `string[]` | — | bindable from `UseCommandPaletteComboboxProps` |
| `defaultValue` | `string[]` | — | from `UseCommandPaletteComboboxProps` |
| `onValueChange` | `(details: CommandPaletteValueChangeDetails) => void` | — | from `UseCommandPaletteComboboxProps` |
| `onSelect` | `(details: CommandPaletteSelectDetails) => void` | — | from `UseCommandPaletteComboboxProps` |
| `inputValue` | `string` | — | bindable from `UseCommandPaletteComboboxProps` |
| `defaultInputValue` | `string` | — | from `UseCommandPaletteComboboxProps` |
| `onInputValueChange` | `(details: CommandPaletteInputValueChangeDetails) => void` | — | from `UseCommandPaletteComboboxProps` |
| `highlightedValue` | `string \| null` | — | bindable from `UseCommandPaletteComboboxProps` |
| `defaultHighlightedValue` | `string \| null` | — | from `UseCommandPaletteComboboxProps` |
| `onHighlightChange` | `(details: CommandPaletteHighlightChangeDetails) => void` | — | from `UseCommandPaletteComboboxProps` |
| `placeholder` | `string` | — | from `UseCommandPaletteComboboxProps` |
| `disabled` | `boolean` | — | from `UseCommandPaletteComboboxProps` |
| `readOnly` | `boolean` | — | from `UseCommandPaletteComboboxProps` |
| `loopFocus` | `boolean` | — | from `UseCommandPaletteComboboxProps` |
| `closeOnSelect` | `boolean` | `true` | from `UseCommandPaletteComboboxProps` |
| `inputBehavior` | `CommandPaletteInputBehavior` | `'autohighlight'` | from `UseCommandPaletteComboboxProps` |
| `selectionBehavior` | `CommandPaletteSelectionBehavior` | `'preserve'` | from `UseCommandPaletteComboboxProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseCommandPaletteComboboxProps` |
| `id` | `string \| null` | — | from `UseCommandPaletteComboboxProps` |
| `ids` | `CommandPaletteComboboxElementIds` | — | from `UseCommandPaletteComboboxProps` |
| `translations` | `Partial<CommandPaletteTranslations>` | — | from `UseCommandPaletteComboboxProps` |
| `children` | `Snippet` | — |  |

### `CommandPaletteItem` — `CommandPaletteItemProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'item'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `CommandPaletteEntry` | — |  |
| `persistFocus` | `boolean` | — |  |

### `CommandPaletteItemGroup` — `CommandPaletteItemGroupProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | — |  |

### `CommandPaletteRootProvider` — `CommandPaletteRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `CommandPaletteApi` | — |  |
| `portalled` | `boolean` | `true` |  |
| `portalRef` | `CommandPalettePortalTarget` | — |  |
| `children` | `Snippet` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `CommandPaletteBackdrop` | `command-palette` | `backdrop` | `command-palette-backdrop` |
| `CommandPaletteClearTrigger` | `command-palette` | `clear-trigger` | `command-palette-clear-trigger` |
| `CommandPaletteCombobox` | `command-palette` | `combobox` | `command-palette-combobox` |
| `CommandPaletteContent` | `command-palette` | `content` | `command-palette-content` |
| `CommandPaletteControl` | `command-palette` | `control` | `command-palette-control` |
| `CommandPaletteDescription` | `command-palette` | `description` | `command-palette-description` |
| `CommandPaletteEmpty` | `command-palette` | `empty` | `command-palette-empty` |
| `CommandPaletteFooter` | `command-palette` | `footer` | `command-palette-footer` |
| `CommandPaletteHeader` | `command-palette` | `header` | `command-palette-header` |
| `CommandPaletteInput` | `command-palette` | `input` | `command-palette-input` |
| `CommandPaletteItem` | `command-palette` | `item` | `command-palette-item` |
| `CommandPaletteItemDescription` | `command-palette` | `item-description` | `command-palette-item-description` |
| `CommandPaletteItemGroup` | `command-palette` | `item-group` | `command-palette-item-group` |
| `CommandPaletteItemGroupLabel` | `command-palette` | `item-group-label` | `command-palette-item-group-label` |
| `CommandPaletteItemIcon` | `command-palette` | `item-icon` | `command-palette-item-icon` |
| `CommandPaletteItemIndicator` | `command-palette` | `item-indicator` | `command-palette-item-indicator` |
| `CommandPaletteItemLabel` | `command-palette` | `item-label` | `command-palette-item-label` |
| `CommandPaletteItemMeta` | `command-palette` | `item-meta` | `command-palette-item-meta` |
| `CommandPaletteItemText` | `command-palette` | `item-text` | `command-palette-item-text` |
| `CommandPaletteKbd` | `command-palette` | `kbd` | `command-palette-kbd` |
| `CommandPaletteList` | `command-palette` | `list` | `command-palette-list` |
| `CommandPalettePositioner` | `command-palette` | `positioner` | `command-palette-positioner` |
| `CommandPaletteSearch` | `—` | `—` | `command-palette-search-icon` |
| `CommandPaletteSeparator` | `command-palette` | `separator` | `command-palette-separator` |
| `CommandPaletteTitle` | `command-palette` | `title` | `command-palette-title` |
| `CommandPaletteTrigger` | `command-palette` | `trigger` | `command-palette-trigger` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-command-palette-max-height` | `34rem` |
| `--moduix-command-palette-width` | `37.5rem` |

## Keyboard

Keys handled by this family: `End`, `Enter`, `Home`, `↑SpaceArrowUp`, `↓SpaceArrowDown`.

## Generated ids

- `combobox:${id}`
- `dialog:${id}:backdrop`
- `dialog:${id}:content`
- `dialog:${id}:description`
- `dialog:${id}:positioner`
- `dialog:${id}:title`
- `dialog:${id}:trigger`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		CommandPalette,
		CommandPaletteCombobox,
		CommandPaletteEmpty,
		CommandPaletteFooter,
		CommandPaletteHeader,
		CommandPaletteItem,
		CommandPaletteItemDescription,
		CommandPaletteItemGroup,
		CommandPaletteItemGroupLabel,
		CommandPaletteItemIcon,
		CommandPaletteItemLabel,
		CommandPaletteItemMeta,
		CommandPaletteItemText,
		CommandPaletteKbd,
		CommandPaletteList,
		CommandPalettePanel,
		CommandPaletteSearch,
		CommandPaletteTitle,
		CommandPaletteTrigger,
		type CommandPaletteEntry
	} from 'rta-ui';

	interface Command extends CommandPaletteEntry {
		label: string;
		section: string;
		description: string;
		icon: string;
		shortcut?: string;
	}

	const commands: Command[] = [
		{
			value: 'new-project',
			label: 'New project',
			section: 'Create',
			description: 'Start a blank workspace',
			icon: '+',
			shortcut: 'N'
		},
		{
			value: 'invite-team',
			label: 'Invite teammates',
			section: 'Create',
			description: 'Send access to the current organization',
			icon: '+',
			shortcut: 'I'
		},
		{
			value: 'recent',
			label: 'Open recent work',
			section: 'Navigate',
			description: 'Jump back to a recently edited file',
			icon: '↗',
			shortcut: 'R'
		},
		{
			value: 'favorites',
			label: 'View favorites',
			section: 'Navigate',
			description: 'Show pinned dashboards and docs',
			icon: '★',
			shortcut: 'F'
		},
		{
			value: 'notes',
			label: 'Release notes',
			section: 'System',
			description: 'Read the latest product changes',
			icon: '↗'
		}
	];

	let query = $state('');
	let lastRun = $state('nothing yet');

	const filtered = $derived(
		commands.filter((item) =>
			`${item.label} ${item.description} ${item.section}`
				.toLowerCase()
				.includes(query.trim().toLowerCase())
		)
	);

	const groups = $derived.by(() => {
		const result: [string, Command[]][] = [];
		for (const item of filtered) {
			const group = result.find(([section]) => section === item.section);
			if (group) group[1].push(item);
			else result.push([item.section, [item]]);
		}
		return result;
	});
</script>

<CommandPalette
	aria-label="Command palette"
	shortcut="mod+k"
	onOpenChange={(details) => {
		if (!details.open) query = '';
	}}
>
	<CommandPaletteTrigger>Open palette</CommandPaletteTrigger>
	<CommandPalettePanel>
		<CommandPaletteCombobox
			items={filtered}
			inputValue={query}
			onInputValueChange={(details) => (query = details.inputValue)}
			onSelect={(details) => (lastRun = details.itemValue)}
		>
			<CommandPaletteHeader>
				<CommandPaletteTitle>Commands</CommandPaletteTitle>
			</CommandPaletteHeader>
			<CommandPaletteSearch placeholder="Search commands, pages, and settings…" />
			<CommandPaletteList>
				<CommandPaletteEmpty>No commands found.</CommandPaletteEmpty>
				{#each groups as [section, entries] (section)}
					<CommandPaletteItemGroup id={section}>
						<CommandPaletteItemGroupLabel>{section}</CommandPaletteItemGroupLabel>
						{#each entries as item (item.value)}
							<CommandPaletteItem {item}>
								<CommandPaletteItemIcon>{item.icon}</CommandPaletteItemIcon>
								<CommandPaletteItemText>
									<CommandPaletteItemLabel>{item.label}</CommandPaletteItemLabel>
									<CommandPaletteItemDescription>{item.description}</CommandPaletteItemDescription>
								</CommandPaletteItemText>
								{#if item.shortcut}
									<CommandPaletteItemMeta>{item.shortcut}</CommandPaletteItemMeta>
								{/if}
							</CommandPaletteItem>
						{/each}
					</CommandPaletteItemGroup>
				{/each}
			</CommandPaletteList>
			<CommandPaletteFooter>
				<span><CommandPaletteKbd>Enter</CommandPaletteKbd> run</span>
				<span><CommandPaletteKbd>Esc</CommandPaletteKbd> close</span>
			</CommandPaletteFooter>
		</CommandPaletteCombobox>
	</CommandPalettePanel>
</CommandPalette>

<p>Last command: {lastRun}. Press <CommandPaletteKbd>⌘</CommandPaletteKbd> <CommandPaletteKbd>K</CommandPaletteKbd> to open the palette.</p>
```

## Behaviour covered by tests

- opens as a dialog and wires ids, slots and aria from the Zag contract
- moves focus to the search input on open and restores it on close
- filters live as the user types and shows the empty state when nothing matches
- walks the list with arrows, home and end, then runs the active command on enter
- toggles from the global shortcut and closes on an outside pointer
- selects an item on click, keeps the query when preserve is set and marks the value
- groups results and labels them through the group contract
- drives the same surface from a hoisted api through the root provider

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
