---
title: HoverCard
component: hover-card
description: Preview a profile or link in a card when its trigger is hovered.
---

# HoverCard

Preview a profile or link in a card when its trigger is hovered.

Port of `moduix/packages/svelte/src/components/hover-card` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { HoverCard } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `HoverCard` | `HoverCard.svelte` | `—` |
| `HoverCardArrow` | `HoverCardArrow.svelte` | `—` |
| `HoverCardArrowTip` | `HoverCardArrowTip.svelte` | `—` |
| `HoverCardBody` | `HoverCardBody.svelte` | `—` |
| `HoverCardContent` | `HoverCardContent.svelte` | `—` |
| `HoverCardPositioner` | `HoverCardPositioner.svelte` | `—` |
| `HoverCardRootProvider` | `HoverCardRootProvider.svelte` | `—` |
| `HoverCardTrigger` | `HoverCardTrigger.svelte` | `—` |

`HoverCard`, `HoverCardRootProvider` render no element of their own: they create the state and provide it to the other parts.

## Props

### `HoverCard` — `HoverCardRootProps`
adds to `UseHoverCardProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseHoverCardProps` |
| `ids` | `HoverCardElementIds` | — | from `UseHoverCardProps` |
| `open` | `boolean` | — | bindable from `UseHoverCardProps` |
| `defaultOpen` | `boolean` | — | from `UseHoverCardProps` |
| `onOpenChange` | `(details: HoverCardOpenChangeDetails) => void` | — | from `UseHoverCardProps` |
| `openDelay` | `number` | — | from `UseHoverCardProps` |
| `closeDelay` | `number` | — | from `UseHoverCardProps` |
| `disabled` | `boolean` | — | from `UseHoverCardProps` |
| `portalled` | `boolean` | — | from `UseHoverCardProps` |
| `portalRef` | `HoverCardPortalRef` | — | from `UseHoverCardProps` |
| `triggerValue` | `string \| null` | — | bindable from `UseHoverCardProps` |
| `defaultTriggerValue` | `string \| null` | — | from `UseHoverCardProps` |
| `onTriggerValueChange` | `(details: HoverCardTriggerValueChangeDetails) => void` | — | from `UseHoverCardProps` |
| `positioning` | `PositionOptions` | — | from `UseHoverCardProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseHoverCardProps` |
| `lazyMount` | `boolean` | — | from `UseHoverCardProps` |
| `unmountOnExit` | `boolean` | — | from `UseHoverCardProps` |
| `onExitComplete` | `() => void` | — | from `UseHoverCardProps` |
| `onPointerDownOutside` | `(event: HoverCardPointerDownOutsideEvent) => void` | — | from `UseHoverCardProps` |
| `onFocusOutside` | `(event: HoverCardFocusOutsideEvent) => void` | — | from `UseHoverCardProps` |
| `onInteractOutside` | `(event: HoverCardInteractOutsideEvent) => void` | — | from `UseHoverCardProps` |
| `children` | `Snippet` | — |  |

### `HoverCardRootProvider` — `HoverCardRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `HoverCardApi` | — |  |
| `children` | `Snippet` | — |  |

### `HoverCardTrigger` — `HoverCardTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `HoverCardArrow` | `hover-card` | `arrow` | `hover-card-arrow` |
| `HoverCardArrowTip` | `hover-card` | `arrow-tip` | `hover-card-arrow-tip` |
| `HoverCardBody` | `hover-card` | `body` | `hover-card-body` |
| `HoverCardContent` | `hover-card` | `content` | `hover-card-content` |
| `HoverCardPositioner` | `hover-card` | `positioner` | `hover-card-positioner` |
| `HoverCardTrigger` | `hover-card` | `trigger` | `hover-card-trigger` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `hover-card:${id}:arrow`
- `hover-card:${id}:content`
- `hover-card:${id}:popper`
- `hover-card:${id}:trigger`
- `hover-card:${id}:trigger:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		HoverCard,
		HoverCardArrow,
		HoverCardBody,
		HoverCardContent,
		HoverCardPositioner,
		HoverCardTrigger
	} from 'rta-ui';
</script>

<p>
	Built by
	<HoverCard openDelay={300} closeDelay={200} positioning={{ placement: 'bottom-start' }}>
		<HoverCardTrigger>@sveltejs</HoverCardTrigger>
		<HoverCardPositioner>
			<HoverCardContent>
				<HoverCardArrow />
				<HoverCardBody>
					<strong>Svelte</strong>
					<br />
					Cybernetically enhanced web apps. Hovering onto the card keeps it open.
				</HoverCardBody>
			</HoverCardContent>
		</HoverCardPositioner>
	</HoverCard>
	in Switzerland.
</p>
```

## Behaviour covered by tests

- renders the ark contract while closed
- opens after the open delay and portals the positioner
- keeps the card open while the pointer crosses from the trigger onto the content
- closes after the close delay when the pointer leaves the trigger
- opens on focus and closes on blur without a pointer
- closes on an outside pointerdown and ignores disabled
- renders the body part, the requested placement and can stay unportalled

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
