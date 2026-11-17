---
title: NavigationMenu
component: navigation-menu
description: Build a site header where items link directly or open panels of links.
---

# NavigationMenu

Build a site header where items link directly or open panels of links.

Port of `moduix/packages/svelte/src/components/navigation-menu` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { NavigationMenu } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `NavigationMenu` | `NavigationMenu.svelte` | `—` |
| `NavigationMenuArrow` | `NavigationMenuArrow.svelte` | `none (aria-hidden)` |
| `NavigationMenuContent` | `NavigationMenuContent.svelte` | `—` |
| `NavigationMenuIndicator` | `NavigationMenuIndicator.svelte` | `none (aria-hidden)` |
| `NavigationMenuItem` | `NavigationMenuItem.svelte` | `—` |
| `NavigationMenuItemIndicator` | `NavigationMenuItemIndicator.svelte` | `none (aria-hidden)` |
| `NavigationMenuLink` | `NavigationMenuLink.svelte` | `—` |
| `NavigationMenuList` | `NavigationMenuList.svelte` | `—` |
| `NavigationMenuRootProvider` | `NavigationMenuRootProvider.svelte` | `—` |
| `NavigationMenuTrigger` | `NavigationMenuTrigger.svelte` | `—` |
| `NavigationMenuViewport` | `NavigationMenuViewport.svelte` | `—` |
| `NavigationMenuViewportPositioner` | `NavigationMenuViewportPositioner.svelte` | `—` |

## Props

### `NavigationMenu` — `NavigationMenuRootProps`
accepts the native props of `HTMLProps<'nav'>`, `PolymorphicProps<'nav'>`, `RefAttribute`, and adds to `UseNavigationMenuProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseNavigationMenuProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseNavigationMenuProps` |
| `value` | `string` | — | bindable from `UseNavigationMenuProps` |
| `defaultValue` | `string` | — | from `UseNavigationMenuProps` |
| `onValueChange` | `(details: NavigationMenuValueChangeDetails) => void` | — | from `UseNavigationMenuProps` |
| `openDelay` | `number` | — | from `UseNavigationMenuProps` |
| `closeDelay` | `number` | — | from `UseNavigationMenuProps` |
| `orientation` | `NavigationMenuOrientation` | — | from `UseNavigationMenuProps` |
| `ids` | `NavigationMenuElementIds` | — | from `UseNavigationMenuProps` |
| `disableClickTrigger` | `boolean` | — | from `UseNavigationMenuProps` |
| `disableHoverTrigger` | `boolean` | — | from `UseNavigationMenuProps` |
| `disablePointerLeaveClose` | `boolean` | — | from `UseNavigationMenuProps` |
| `translations` | `NavigationMenuIntlTranslations` | — | from `UseNavigationMenuProps` |
| `lazyMount` | `boolean` | — | from `UseNavigationMenuProps` |
| `unmountOnExit` | `boolean` | — | from `UseNavigationMenuProps` |
| `closeOnEscape` | `boolean` | — | from `UseNavigationMenuProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseNavigationMenuProps` |
| `onExitComplete` | `() => void` | — | from `UseNavigationMenuProps` |

### `NavigationMenuContent` — `NavigationMenuContentProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` |  |

### `NavigationMenuItem` — `NavigationMenuItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |

### `NavigationMenuLink` — `NavigationMenuLinkProps`
accepts the native props of `HTMLProps<'a'>`, `PolymorphicProps<'a'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` |  |
| `current` | `boolean` | `undefined` |  |
| `closeOnClick` | `boolean` | `undefined` |  |
| `onSelect` | `(event: CustomEvent) => void` | `undefined` |  |

### `NavigationMenuRootProvider` — `NavigationMenuRootProviderProps`
accepts the native props of `HTMLProps<'nav'>`, `PolymorphicProps<'nav'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `NavigationMenuApi` | — |  |

### `NavigationMenuTrigger` — `NavigationMenuTriggerProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type' | 'value'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `disabled` | `boolean` | — |  |

### `NavigationMenuViewportPositioner` — `NavigationMenuViewportPositionerProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `align` | `NavigationMenuAlign` | `undefined` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `NavigationMenu` | `navigation-menu` | `root` | `navigation-menu-root` |
| `NavigationMenuArrow` | `navigation-menu` | `arrow` | `navigation-menu-arrow` |
| `NavigationMenuContent` | `navigation-menu` | `content` | `navigation-menu-content` |
| `NavigationMenuIndicator` | `navigation-menu` | `indicator` | `navigation-menu-indicator` |
| `NavigationMenuItem` | `navigation-menu` | `item` | `navigation-menu-item` |
| `NavigationMenuItemIndicator` | `navigation-menu` | `item-indicator` | `navigation-menu-item-indicator` |
| `NavigationMenuLink` | `navigation-menu` | `link` | `navigation-menu-link` |
| `NavigationMenuList` | `navigation-menu` | `list` | `navigation-menu-list` |
| `NavigationMenuRootProvider` | `navigation-menu` | `root` | `navigation-menu-root-provider` |
| `NavigationMenuTrigger` | `navigation-menu` | `trigger` | `navigation-menu-trigger` |
| `NavigationMenuViewport` | `navigation-menu` | `viewport` | `navigation-menu-viewport` |
| `NavigationMenuViewportPositioner` | `navigation-menu` | `viewport-positioner` | `navigation-menu-viewport-positioner` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-navigation-menu-content-max-height` | `24rem` |
| `--moduix-navigation-menu-content-max-width` | `20rem` |
| `--moduix-navigation-menu-content-min-width` | `12rem` |
| `--moduix-navigation-menu-viewport-max-height` | `32rem` |
| `--moduix-navigation-menu-viewport-max-width` | `40rem` |

## Keyboard

Keys handled by this family: `End`, `Home`, `Tab`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `nav-menu:${id}`
- `nav-menu:${id}:content:${id}`
- `nav-menu:${id}:item:${id}`
- `nav-menu:${id}:list`
- `nav-menu:${id}:trigger-proxy:${id}`
- `nav-menu:${id}:trigger:${id}`
- `nav-menu:${id}:viewport`
- `position: absolute;${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		NavigationMenu,
		NavigationMenuContent,
		NavigationMenuIndicator,
		NavigationMenuItem,
		NavigationMenuItemIndicator,
		NavigationMenuLink,
		NavigationMenuList,
		NavigationMenuTrigger,
		NavigationMenuViewport,
		NavigationMenuViewportPositioner
	} from 'rta-ui';

	let value = $state('products');
</script>

<p>Open: {value || 'none'}</p>

<NavigationMenu bind:value>
	<NavigationMenuList>
		<NavigationMenuItem value="products">
			<NavigationMenuTrigger>Products</NavigationMenuTrigger>
			<NavigationMenuContent>
				<NavigationMenuLink href="#analytics">Analytics</NavigationMenuLink>
				<NavigationMenuLink href="#automation">Automation</NavigationMenuLink>
			</NavigationMenuContent>
			<NavigationMenuItemIndicator />
		</NavigationMenuItem>
		<NavigationMenuItem value="company">
			<NavigationMenuTrigger>Company</NavigationMenuTrigger>
			<NavigationMenuContent>
				<NavigationMenuLink href="#about" current>About</NavigationMenuLink>
				<NavigationMenuLink href="#careers">Careers</NavigationMenuLink>
			</NavigationMenuContent>
		</NavigationMenuItem>
		<NavigationMenuIndicator />
	</NavigationMenuList>
	<NavigationMenuViewportPositioner>
		<NavigationMenuViewport />
	</NavigationMenuViewportPositioner>
</NavigationMenu>
```

## Behaviour covered by tests

- renders the ark contract while closed
- opens on hover after openDelay and closes after closeDelay
- switches open item on click and toggles it closed
- moves between triggers with the arrow keys and into the content with ArrowDown
- moves the open content into the measured viewport
- closes on Escape and on focus or pointer outside
- closes when focus leaves the menu for an outside control
- closes on link activation and honours current, onSelect and closeOnClick

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
