---
title: Drawer
component: drawer
description: Slide a panel in from a screen edge, with swipe and snap points.
---

# Drawer

Slide a panel in from a screen edge, with swipe and snap points.

Port of `moduix/packages/svelte/src/components/drawer` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Drawer } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Drawer` | `Drawer.svelte` | `—` |
| `DrawerBackdrop` | `DrawerBackdrop.svelte` | `—` |
| `DrawerBody` | `DrawerBody.svelte` | `—` |
| `DrawerCloseIcon` | `DrawerCloseIcon.svelte` | `—` |
| `DrawerCloseTrigger` | `DrawerCloseTrigger.svelte` | `—` |
| `DrawerContent` | `DrawerContent.svelte` | `—` |
| `DrawerDescription` | `DrawerDescription.svelte` | `—` |
| `DrawerFooter` | `DrawerFooter.svelte` | `—` |
| `DrawerGrabber` | `DrawerGrabber.svelte` | `—` |
| `DrawerGrabberIndicator` | `DrawerGrabberIndicator.svelte` | `—` |
| `DrawerHeader` | `DrawerHeader.svelte` | `—` |
| `DrawerIndent` | `DrawerIndent.svelte` | `—` |
| `DrawerIndentBackground` | `DrawerIndentBackground.svelte` | `—` |
| `DrawerPositioner` | `DrawerPositioner.svelte` | `—` |
| `DrawerRootProvider` | `DrawerRootProvider.svelte` | `—` |
| `DrawerStack` | `DrawerStack.svelte` | `—` |
| `DrawerSwipeArea` | `DrawerSwipeArea.svelte` | `presentation` |
| `DrawerTitle` | `DrawerTitle.svelte` | `—` |
| `DrawerTrigger` | `DrawerTrigger.svelte` | `—` |

`Drawer`, `DrawerRootProvider`, `DrawerStack` render no element of their own: they create the state and provide it to the other parts.

ARIA roles rendered by this family: `dialog`, `presentation`.

## Props

### `Drawer` — `DrawerRootProps`
adds to `UseDrawerProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `open` | `boolean` | — | bindable from `UseDrawerProps` |
| `defaultOpen` | `boolean` | — | from `UseDrawerProps` |
| `onOpenChange` | `(details: DrawerOpenChangeDetails) => void` | — | from `UseDrawerProps` |
| `triggerValue` | `string \| null` | — | bindable from `UseDrawerProps` |
| `defaultTriggerValue` | `string \| null` | — | from `UseDrawerProps` |
| `onTriggerValueChange` | `(details: DrawerTriggerValueChangeDetails) => void` | — | from `UseDrawerProps` |
| `snapPoints` | `DrawerSnapPoint[]` | — | from `UseDrawerProps` |
| `snapPoint` | `DrawerSnapPoint \| null` | — | bindable from `UseDrawerProps` |
| `defaultSnapPoint` | `DrawerSnapPoint \| null` | — | from `UseDrawerProps` |
| `onSnapPointChange` | `(details: DrawerSnapPointChangeDetails) => void` | — | from `UseDrawerProps` |
| `snapToSequentialPoints` | `boolean` | — | from `UseDrawerProps` |
| `swipeDirection` | `DrawerSwipeDirection` | — | from `UseDrawerProps` |
| `swipeVelocityThreshold` | `number` | — | from `UseDrawerProps` |
| `closeThreshold` | `number` | — | from `UseDrawerProps` |
| `preventDragOnScroll` | `boolean` | — | from `UseDrawerProps` |
| `modal` | `boolean` | — | from `UseDrawerProps` |
| `role` | `DrawerRole` | — | from `UseDrawerProps` |
| `trapFocus` | `boolean` | — | from `UseDrawerProps` |
| `preventScroll` | `boolean` | — | from `UseDrawerProps` |
| `restoreFocus` | `boolean` | — | from `UseDrawerProps` |
| `closeOnEscape` | `boolean` | — | from `UseDrawerProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseDrawerProps` |
| `initialFocusEl` | `() => Element \| null \| undefined \| false` | — | from `UseDrawerProps` |
| `finalFocusEl` | `() => Element \| null \| undefined` | — | from `UseDrawerProps` |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | from `UseDrawerProps` |
| `onFocusOutside` | `(event: DrawerFocusOutsideEvent) => void` | — | from `UseDrawerProps` |
| `onInteractOutside` | `(event: DrawerInteractOutsideEvent) => void` | — | from `UseDrawerProps` |
| `onPointerDownOutside` | `(event: DrawerPointerDownOutsideEvent) => void` | — | from `UseDrawerProps` |
| `persistentElements` | `(() => Element \| null \| undefined)[]` | — | from `UseDrawerProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseDrawerProps` |
| `id` | `string \| null` | — | from `UseDrawerProps` |
| `ids` | `DrawerElementIds` | — | from `UseDrawerProps` |
| `stack` | `DrawerStack` | — | from `UseDrawerProps` |
| `lazyMount` | `boolean` | `true` | from `UseDrawerProps` |
| `unmountOnExit` | `boolean` | `true` | from `UseDrawerProps` |
| `onExitComplete` | `() => void` | — | from `UseDrawerProps` |
| `portalled` | `boolean` | `true` | from `UseDrawerProps` |
| `portalRef` | `DrawerPortalTarget` | — | from `UseDrawerProps` |
| `children` | `Snippet` | — |  |

### `DrawerCloseIcon` — `DrawerCloseIconProps`
adds to `Omit<DrawerCloseTriggerProps, 'asChild' | 'class'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `class` | `string` | — |  |

### `DrawerContent` — `DrawerContentProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'draggable'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `size` | `DrawerSize` | `'md'` | Width preset for `start` and `end` drawers: 18rem, 22rem, 28rem, or 36rem. |
| `variant` | `DrawerVariant` | — | `island` insets the surface from the viewport edges and rounds every corner. |
| `draggable` | `boolean` | `true` | Whether the content itself starts a swipe. `false` leaves dragging to `DrawerGrabber`. |

### `DrawerRootProvider` — `DrawerRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `DrawerApi` | — |  |
| `portalled` | `boolean` | `true` |  |
| `portalRef` | `DrawerPortalTarget` | — |  |
| `children` | `Snippet` | — |  |

### `DrawerSwipeArea` — `DrawerSwipeAreaProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Turns the edge region off without unmounting it. |
| `swipeDirection` | `DrawerSwipeDirection` | — | Direction that opens the drawer. Defaults to the opposite of `swipeDirection`. |

### `DrawerTrigger` — `DrawerTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies this trigger when one drawer has several. |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `DrawerBackdrop` | `drawer` | `backdrop` | `drawer-backdrop` |
| `DrawerBody` | `—` | `—` | `drawer-body` |
| `DrawerCloseIcon` | `drawer` | `close-trigger` | `drawer-close-icon` |
| `DrawerCloseTrigger` | `drawer` | `close-trigger` | `drawer-close-trigger` |
| `DrawerContent` | `drawer` | `content` | `drawer-content` |
| `DrawerDescription` | `drawer` | `description` | `drawer-description` |
| `DrawerFooter` | `—` | `—` | `drawer-footer` |
| `DrawerGrabber` | `drawer` | `grabber` | `drawer-grabber` |
| `DrawerGrabberIndicator` | `drawer` | `grabber-indicator` | `drawer-grabber-indicator` |
| `DrawerHeader` | `—` | `—` | `drawer-header` |
| `DrawerIndent` | `—` | `—` | `drawer-indent` |
| `DrawerIndentBackground` | `—` | `—` | `drawer-indent-background` |
| `DrawerPositioner` | `drawer` | `positioner` | `drawer-positioner` |
| `DrawerSwipeArea` | `drawer` | `swipe-area` | `drawer-swipe-area` |
| `DrawerTitle` | `drawer` | `title` | `drawer-title` |
| `DrawerTrigger` | `drawer` | `trigger` | `drawer-trigger` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-drawer-island-inset` | `var(--moduix-spacing-4)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `drawer:${id}:backdrop`
- `drawer:${id}:close-trigger`
- `drawer:${id}:content`
- `drawer:${id}:description`
- `drawer:${id}:grabber`
- `drawer:${id}:grabber-indicator`
- `drawer:${id}:positioner`
- `drawer:${id}:swipe-area`
- `drawer:${id}:title`
- `drawer:${id}:trigger`
- `drawer:${id}:trigger:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Drawer,
		DrawerBackdrop,
		DrawerBody,
		DrawerCloseIcon,
		DrawerCloseTrigger,
		DrawerContent,
		DrawerDescription,
		DrawerFooter,
		DrawerGrabber,
		DrawerGrabberIndicator,
		DrawerHeader,
		DrawerPositioner,
		DrawerSwipeArea,
		DrawerTitle,
		DrawerTrigger
	} from 'rta-ui';
	import Button from '../../lib/components/button/Button.svelte';
</script>

<Drawer snapPoints={[0.5, 1]} defaultSnapPoint={0.5}>
	<DrawerTrigger>Open filters</DrawerTrigger>
	<DrawerSwipeArea />
	<DrawerBackdrop />
	<DrawerPositioner>
		<DrawerContent size="md">
			<DrawerGrabber><DrawerGrabberIndicator /></DrawerGrabber>
			<DrawerHeader>
				<DrawerTitle>Filters</DrawerTitle>
				<DrawerDescription>Drag the handle to change the height.</DrawerDescription>
			</DrawerHeader>
			<DrawerBody>Status, owner, and label filters live here.</DrawerBody>
			<DrawerFooter>
				<DrawerCloseTrigger>Reset</DrawerCloseTrigger>
				<Button>Apply</Button>
			</DrawerFooter>
			<DrawerCloseIcon />
		</DrawerContent>
	</DrawerPositioner>
</Drawer>
```

## Behaviour covered by tests

- applies ids and data hooks from the Zag contract
- closes on escape and on the close trigger, restoring focus
- resolves snap points into offsets and reports the active one
- a downward drag on the content dismisses the drawer
- a short drag falls back to the active snap point
- snapToSequentialPoints moves one snap point at a time
- the root provider reports active and next snap point state
- a non-modal drawer stays interactive and draggable={false} leaves dragging to the grabber

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
