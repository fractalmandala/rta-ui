---
title: Toast
component: toast
description: Show brief notifications that stack and dismiss on their own.
---

# Toast

Show brief notifications that stack and dismiss on their own.

Port of `moduix/packages/svelte/src/components/toast` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Toast } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Toast` | `Toast.svelte` | `status` |
| `ToastActionTrigger` | `ToastActionTrigger.svelte` | `—` |
| `ToastCloseTrigger` | `ToastCloseTrigger.svelte` | `—` |
| `ToastContext` | `ToastContext.svelte` | `—` |
| `ToastDescription` | `ToastDescription.svelte` | `—` |
| `ToastIcon` | `ToastIcon.svelte` | `none (aria-hidden)` |
| `ToastProgress` | `ToastProgress.svelte` | `presentation` |
| `ToastTitle` | `ToastTitle.svelte` | `—` |
| `ToastToaster` | `ToastToaster.svelte` | `—` |
| `ToastViewport` | `ToastViewport.svelte` | `region` |

`ToastContext` renders no element of its own: it creates the state and provides it to the other parts.

ARIA roles rendered by this family: `presentation`, `region`, `status`.

## Props

### `ToastContext` — `ToastContextProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `render` | `Snippet<[ToastApi]>` | — |  |

### `ToastIcon` — `ToastIconProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute<HTMLSpanElement>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `size` | `number` | `16` |  |

### `ToastToaster` — `ToasterProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id' | 'children'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `toaster` | `CreateToasterReturn` | — |  |
| `children` | `Snippet<[() => ToastRecord]>` | — |  |
| `id` | `string \| null` | `undefined` |  |
| `label` | `string` | `undefined` |  |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | `undefined` |  |
| `portalled` | `boolean` | `true` |  |
| `portalRef` | `ToastPortalRef` | `undefined` |  |

### `ToastViewport` — `ToastViewportProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'children'>`, `Omit<PolymorphicProps<'div'>, 'children'>`, `RefAttribute<HTMLDivElement>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet<[() => ToastRecord]>` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Toast` | `toast` | `root` | `toast-root` |
| `ToastActionTrigger` | `toast` | `action-trigger` | `toast-action-trigger` |
| `ToastCloseTrigger` | `toast` | `close-trigger` | `toast-close-trigger` |
| `ToastDescription` | `toast` | `description` | `toast-description` |
| `ToastIcon` | `toast` | `icon` | `toast-icon` |
| `ToastProgress` | `toast` | `progress` | `toast-progress` |
| `ToastTitle` | `toast` | `title` | `toast-title` |
| `ToastToaster` | `—` | `—` | `toast-toaster` |
| `ToastViewport` | `toast` | `group` | `—` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-toast-bg` | `var(--_toast-bg)` |
| `--moduix-toast-border-color` | `var(--_toast-border-color)` |
| `--moduix-toast-color` | `var(--_toast-color)` |
| `--moduix-toast-description-color` | `var(--moduix-muted-foreground)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `toast-group:${id}`
- `toast:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { ToastToaster, createToaster } from 'rta-ui';

	const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 16, max: 4 });

	function upload() {
		const file = Promise.resolve('report.pdf');
		toaster.promise(file, {
			loading: { title: 'Uploading', description: 'Sending report.pdf' },
			success: { title: 'Uploaded', description: 'report.pdf is on the server.' },
			error: { title: 'Upload failed', description: 'Try again in a moment.' }
		});
	}
</script>

<div class="demo-row">
	<button
		type="button"
		onclick={() => toaster.info({ title: 'Saved', description: 'Your changes are stored.' })}>
		Info toast
	</button>
	<button
		type="button"
		onclick={() => toaster.success({ title: 'Workspace synced', description: 'Everyone has the new map.' })}>
		Success toast
	</button>
	<button
		type="button"
		onclick={() => toaster.error({ title: 'Upload failed', description: 'The file is larger than 10 MB.' })}>
		Error toast
	</button>
	<button
		type="button"
		onclick={() =>
			toaster.warning({ title: 'Storage almost full', description: '92% of the quota is used.' })}>
		Warning toast
	</button>
	<button type="button" onclick={upload}>Promise toast</button>
	<button
		type="button"
		onclick={() =>
			toaster.create({
				title: 'File deleted',
				description: 'The file left the workspace.',
				action: { label: 'Undo', onClick: () => toaster.success({ title: 'Restored' }) }
			})}>
		Action toast
	</button>
	<button type="button" onclick={() => toaster.dismiss()}>Dismiss all</button>
</div>

<ToastToaster {toaster} label="Notifications" />
```

## Behaviour covered by tests

- renders the group region contract before any toast exists
- wires ids, data hooks and the aria contract on a toast
- marks the front toast and expands the stack on pointer enter
- closes through the close trigger: closing state then unmount
- auto dismisses after the duration and pauses while hovered
- runs the action once and dismisses the toast
- queues over the maximum and reveals the queued toast after removal
- moves a promise toast from loading to success and updates in place
- renders the icon and progress parts with live progress state
- is RTL aware for the group placement style

## Notes

- **Parity:** accepted deviation — Upstream keeps the icon, progress and viewport inside the toaster; here they are public parts so a toast can be laid out explicitly.
  Extra slots: `toast-icon`, `toast-progress`, `toast-progress-bar`, `toast-viewport`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
