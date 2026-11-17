---
title: Dialog
component: dialog
description: Open a modal window for a form, confirmation, or details.
---

# Dialog

Open a modal window for a form, confirmation, or details.

Port of `moduix/packages/svelte/src/components/dialog` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Dialog } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Dialog` | `Dialog.svelte` | `—` |
| `DialogBackdrop` | `DialogBackdrop.svelte` | `—` |
| `DialogBody` | `DialogBody.svelte` | `—` |
| `DialogCloseIcon` | `DialogCloseIcon.svelte` | `—` |
| `DialogCloseTrigger` | `DialogCloseTrigger.svelte` | `—` |
| `DialogContent` | `DialogContent.svelte` | `—` |
| `DialogDescription` | `DialogDescription.svelte` | `—` |
| `DialogFooter` | `DialogFooter.svelte` | `—` |
| `DialogHeader` | `DialogHeader.svelte` | `—` |
| `DialogPositioner` | `DialogPositioner.svelte` | `—` |
| `DialogRootProvider` | `DialogRootProvider.svelte` | `—` |
| `DialogTitle` | `DialogTitle.svelte` | `—` |
| `DialogTrigger` | `DialogTrigger.svelte` | `—` |

`Dialog`, `DialogRootProvider` render no element of their own: they create the state and provide it to the other parts.

ARIA roles rendered by this family: `dialog`.

## Props

### `Dialog` — `DialogRootProps`
adds to `UseDialogProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `open` | `boolean` | — | bindable from `UseDialogProps` |
| `defaultOpen` | `boolean` | — | from `UseDialogProps` |
| `onOpenChange` | `(details: DialogOpenChangeDetails) => void` | — | from `UseDialogProps` |
| `triggerValue` | `string \| null` | — | bindable from `UseDialogProps` |
| `defaultTriggerValue` | `string \| null` | — | from `UseDialogProps` |
| `onTriggerValueChange` | `(details: DialogTriggerValueChangeDetails) => void` | — | from `UseDialogProps` |
| `modal` | `boolean` | — | from `UseDialogProps` |
| `role` | `DialogRole` | — | from `UseDialogProps` |
| `trapFocus` | `boolean` | — | from `UseDialogProps` |
| `preventScroll` | `boolean` | — | from `UseDialogProps` |
| `restoreFocus` | `boolean` | — | from `UseDialogProps` |
| `closeOnEscape` | `boolean` | — | from `UseDialogProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseDialogProps` |
| `aria-label` | `string` | — | from `UseDialogProps` |
| `initialFocusEl` | `() => Element \| null \| undefined \| false` | — | from `UseDialogProps` |
| `finalFocusEl` | `() => Element \| null \| undefined` | — | from `UseDialogProps` |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | — | from `UseDialogProps` |
| `onFocusOutside` | `(event: DialogFocusOutsideEvent) => void` | — | from `UseDialogProps` |
| `onInteractOutside` | `(event: DialogInteractOutsideEvent) => void` | — | from `UseDialogProps` |
| `onPointerDownOutside` | `(event: DialogPointerDownOutsideEvent) => void` | — | from `UseDialogProps` |
| `persistentElements` | `(() => Element \| null \| undefined)[]` | — | from `UseDialogProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseDialogProps` |
| `id` | `string \| null` | — | from `UseDialogProps` |
| `ids` | `DialogElementIds` | — | from `UseDialogProps` |
| `lazyMount` | `boolean` | `true` | from `UseDialogProps` |
| `unmountOnExit` | `boolean` | `true` | from `UseDialogProps` |
| `onExitComplete` | `() => void` | — | from `UseDialogProps` |
| `portalled` | `boolean` | `true` | Render the overlay inside `document.body`. Set `false` to keep it in place. from `UseDialogProps` |
| `portalRef` | `DialogPortalTarget` | — | Element or getter for the portal container. from `UseDialogProps` |
| `children` | `Snippet` | — |  |

### `DialogCloseIcon` — `DialogCloseIconProps`
adds to `Omit<DialogCloseTriggerProps, 'asChild' | 'class'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `class` | `string` | — |  |

### `DialogContent` — `DialogContentProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `size` | `DialogSize` | `'md'` | Width preset. `full` covers the viewport. |
| `placement` | `DialogPlacement` | `'center'` | Vertical position inside the positioner. |
| `scrollBehavior` | `DialogScrollBehavior` | `'outside'` | `outside` scrolls the positioner; `inside` caps the content and scrolls `DialogBody`. |

### `DialogRootProvider` — `DialogRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `DialogApi` | — |  |
| `portalled` | `boolean` | `true` |  |
| `portalRef` | `DialogPortalTarget` | — |  |
| `children` | `Snippet` | — |  |

### `DialogTrigger` — `DialogTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies this trigger when one dialog has several. |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `DialogBackdrop` | `dialog` | `backdrop` | `dialog-backdrop` |
| `DialogBody` | `—` | `—` | `dialog-body` |
| `DialogCloseIcon` | `dialog` | `close-trigger` | `dialog-close-icon` |
| `DialogCloseTrigger` | `dialog` | `close-trigger` | `dialog-close-trigger` |
| `DialogContent` | `dialog` | `content` | `dialog-content` |
| `DialogDescription` | `dialog` | `description` | `dialog-description` |
| `DialogFooter` | `—` | `—` | `dialog-footer` |
| `DialogHeader` | `—` | `—` | `dialog-header` |
| `DialogPositioner` | `dialog` | `positioner` | `dialog-positioner` |
| `DialogTitle` | `dialog` | `title` | `dialog-title` |
| `DialogTrigger` | `dialog` | `trigger` | `dialog-trigger` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-dialog-width` | `var(--_dialog-width)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `dialog:${id}:backdrop`
- `dialog:${id}:close`
- `dialog:${id}:content`
- `dialog:${id}:description`
- `dialog:${id}:positioner`
- `dialog:${id}:title`
- `dialog:${id}:trigger`
- `dialog:${id}:trigger:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Dialog,
		DialogBackdrop,
		DialogBody,
		DialogCloseIcon,
		DialogCloseTrigger,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogPositioner,
		DialogTitle,
		DialogTrigger
	} from 'rta-ui';
	import Button from '../../lib/components/button/Button.svelte';
</script>

<Dialog>
	<DialogTrigger>Edit profile</DialogTrigger>
	<DialogBackdrop />
	<DialogPositioner>
		<DialogContent size="md" placement="center">
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>Update the details shown on your public page.</DialogDescription>
			</DialogHeader>
			<DialogBody>Changes apply as soon as you save.</DialogBody>
			<DialogFooter>
				<DialogCloseTrigger>Cancel</DialogCloseTrigger>
				<Button>Save</Button>
			</DialogFooter>
			<DialogCloseIcon />
		</DialogContent>
	</DialogPositioner>
</Dialog>
```

## Behaviour covered by tests

- applies ids and data hooks from the Zag contract
- closes on escape, restores focus to the trigger and unmounts
- closes on an outside pointer that starts and ends on the backdrop
- a non-modal dialog keeps pointer events and skips aria-modal
- a modal dialog locks scroll and hides the page from assistive tech
- title and description are only advertised when their parts render
- portalled={false} renders the overlay in place
- lazyMount={false} keeps a closed dialog mounted but hidden
- the close icon and close trigger both dismiss, and unmountOnExit=false stays mounted

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
