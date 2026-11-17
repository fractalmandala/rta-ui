---
title: Popover
component: popover
description: Show interactive content in a panel anchored to a trigger.
---

# Popover

Show interactive content in a panel anchored to a trigger.

Port of `moduix/packages/svelte/src/components/popover` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Popover` | `Popover.svelte` |
| `PopoverAnchor` | `PopoverAnchor.svelte` |
| `PopoverArrow` | `PopoverArrow.svelte` |
| `PopoverArrowTip` | `PopoverArrowTip.svelte` |
| `PopoverBody` | `PopoverBody.svelte` |
| `PopoverCloseIcon` | `PopoverCloseIcon.svelte` |
| `PopoverCloseTrigger` | `PopoverCloseTrigger.svelte` |
| `PopoverContent` | `PopoverContent.svelte` |
| `PopoverDescription` | `PopoverDescription.svelte` |
| `PopoverFooter` | `PopoverFooter.svelte` |
| `PopoverHeader` | `PopoverHeader.svelte` |
| `PopoverIndicator` | `PopoverIndicator.svelte` |
| `PopoverPositioner` | `PopoverPositioner.svelte` |
| `PopoverRootProvider` | `PopoverRootProvider.svelte` |
| `PopoverTitle` | `PopoverTitle.svelte` |
| `PopoverTrigger` | `PopoverTrigger.svelte` |

`Popover`, `PopoverRootProvider` render no element of their own: they create the state and provide it to the other parts.

## Props

### `Popover` — `PopoverRootProps`
adds to `UsePopoverProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UsePopoverProps` |
| `ids` | `PopoverElementIds` | — | from `UsePopoverProps` |
| `translations` | `PopoverIntlTranslations` | — | from `UsePopoverProps` |
| `open` | `boolean` | — | bindable from `UsePopoverProps` |
| `defaultOpen` | `boolean` | — | from `UsePopoverProps` |
| `onOpenChange` | `(details: PopoverOpenChangeDetails) => void` | — | from `UsePopoverProps` |
| `triggerValue` | `string \| null` | — | bindable from `UsePopoverProps` |
| `defaultTriggerValue` | `string \| null` | — | from `UsePopoverProps` |
| `onTriggerValueChange` | `(details: PopoverTriggerValueChangeDetails) => void` | — | from `UsePopoverProps` |
| `modal` | `boolean` | — | from `UsePopoverProps` |
| `portalled` | `boolean` | — | from `UsePopoverProps` |
| `portalRef` | `PopoverPortalRef` | — | from `UsePopoverProps` |
| `autoFocus` | `boolean` | — | from `UsePopoverProps` |
| `initialFocusEl` | `() => HTMLElement \| null \| false` | — | from `UsePopoverProps` |
| `finalFocusEl` | `() => HTMLElement \| null` | — | from `UsePopoverProps` |
| `restoreFocus` | `boolean` | — | from `UsePopoverProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UsePopoverProps` |
| `closeOnEscape` | `boolean` | — | from `UsePopoverProps` |
| `positioning` | `PositionOptions` | — | from `UsePopoverProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UsePopoverProps` |
| `lazyMount` | `boolean` | — | from `UsePopoverProps` |
| `unmountOnExit` | `boolean` | — | from `UsePopoverProps` |
| `onExitComplete` | `() => void` | — | from `UsePopoverProps` |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | from `UsePopoverProps` |
| `onPointerDownOutside` | `(event: PopoverPointerDownOutsideEvent) => void` | — | from `UsePopoverProps` |
| `onFocusOutside` | `(event: PopoverFocusOutsideEvent) => void` | — | from `UsePopoverProps` |
| `onInteractOutside` | `(event: PopoverInteractOutsideEvent) => void` | — | from `UsePopoverProps` |
| `children` | `Snippet` | — |  |

### `PopoverRootProvider` — `PopoverRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `PopoverApi` | — |  |
| `children` | `Snippet` | — |  |

### `PopoverTrigger` — `PopoverTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `PopoverAnchor` | `popover` | `anchor` | `popover-anchor` |
| `PopoverArrow` | `popover` | `arrow` | `popover-arrow` |
| `PopoverArrowTip` | `popover` | `arrow-tip` | `popover-arrow-tip` |
| `PopoverBody` | `popover` | `body` | `popover-body` |
| `PopoverCloseIcon` | `popover` | `close-trigger` | `popover-close-icon` |
| `PopoverCloseTrigger` | `popover` | `close-trigger` | `popover-close-trigger` |
| `PopoverContent` | `popover` | `content` | `popover-content` |
| `PopoverDescription` | `popover` | `description` | `popover-description` |
| `PopoverFooter` | `popover` | `footer` | `popover-footer` |
| `PopoverHeader` | `popover` | `header` | `popover-header` |
| `PopoverIndicator` | `popover` | `indicator` | `popover-indicator` |
| `PopoverPositioner` | `popover` | `positioner` | `popover-positioner` |
| `PopoverTitle` | `popover` | `title` | `popover-title` |
| `PopoverTrigger` | `popover` | `trigger` | `popover-trigger` |

Custom properties read by this family’s CSS Module:

- `--moduix-popover`
- `--moduix-popover-foreground`

## Generated ids

- `popover:${id}:anchor`
- `popover:${id}:arrow`
- `popover:${id}:close`
- `popover:${id}:content`
- `popover:${id}:desc`
- `popover:${id}:popper`
- `popover:${id}:title`
- `popover:${id}:trigger`
- `popover:${id}:trigger:${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		Popover,
		PopoverArrow,
		PopoverBody,
		PopoverCloseIcon,
		PopoverCloseTrigger,
		PopoverContent,
		PopoverDescription,
		PopoverFooter,
		PopoverHeader,
		PopoverIndicator,
		PopoverPositioner,
		PopoverTitle,
		PopoverTrigger
	} from 'rta-ui';

	let open = $state(false);
</script>

<p>Open: {open ? 'yes' : 'no'}</p>

<Popover bind:open positioning={{ placement: 'bottom-start' }}>
	<PopoverTrigger>
		Notification settings
		<PopoverIndicator>▾</PopoverIndicator>
	</PopoverTrigger>
	<PopoverPositioner>
		<PopoverContent>
			<PopoverArrow />
			<PopoverHeader>
				<PopoverTitle>Emails</PopoverTitle>
				<PopoverDescription>Choose what lands in your inbox.</PopoverDescription>
			</PopoverHeader>
			<PopoverBody>
				<label><input type="checkbox" checked /> Weekly digest</label>
			</PopoverBody>
			<PopoverFooter>
				<PopoverCloseTrigger>Save</PopoverCloseTrigger>
			</PopoverFooter>
			<PopoverCloseIcon />
		</PopoverContent>
	</PopoverPositioner>
</Popover>
```

## Behaviour covered by tests

- renders the ark contract while closed
- opens on click, portals the positioner and wires the content contract
- closes on the close trigger and on Escape, returning focus to the trigger
- dismisses on an outside pointerdown unless closeOnInteractOutside is false
- honours positioning placement and portalled={false}
- renders the close icon, anchor and modal contract
- keeps the content mounted but hidden when unmountOnExit is false

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
