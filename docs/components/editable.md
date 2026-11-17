---
title: Editable
component: editable
description: Edit a short text in place and save or cancel the change.
---

# Editable

Edit a short text in place and save or cancel the change.

Port of `moduix/packages/svelte/src/components/editable` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Editable` | `Editable.svelte` |
| `EditableArea` | `EditableArea.svelte` |
| `EditableCancelTrigger` | `EditableCancelTrigger.svelte` |
| `EditableControl` | `EditableControl.svelte` |
| `EditableControls` | `EditableControls.svelte` |
| `EditableEditTrigger` | `EditableEditTrigger.svelte` |
| `EditableInput` | `EditableInput.svelte` |
| `EditableLabel` | `EditableLabel.svelte` |
| `EditablePreview` | `EditablePreview.svelte` |
| `EditableRootProvider` | `EditableRootProvider.svelte` |
| `EditableSubmitTrigger` | `EditableSubmitTrigger.svelte` |

## Props

### `Editable` — `EditableRootProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'placeholder'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseEditableProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseEditableProps` |
| `ids` | `EditableElementIds` | — | from `UseEditableProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseEditableProps` |
| `value` | `string` | — | bindable from `UseEditableProps` |
| `defaultValue` | `string` | — | from `UseEditableProps` |
| `edit` | `boolean` | — | bindable from `UseEditableProps` |
| `defaultEdit` | `boolean` | — | from `UseEditableProps` |
| `name` | `string` | — | from `UseEditableProps` |
| `form` | `string` | — | from `UseEditableProps` |
| `maxLength` | `number` | — | from `UseEditableProps` |
| `placeholder` | `string \| EditablePlaceholder` | — | from `UseEditableProps` |
| `translations` | `EditableTranslations` | — | from `UseEditableProps` |
| `autoResize` | `boolean` | — | from `UseEditableProps` |
| `activationMode` | `EditableActivationMode` | `'dblclick'` | from `UseEditableProps` |
| `submitMode` | `EditableSubmitMode` | — | from `UseEditableProps` |
| `selectOnFocus` | `boolean` | — | from `UseEditableProps` |
| `disabled` | `boolean` | — | from `UseEditableProps` |
| `readOnly` | `boolean` | — | from `UseEditableProps` |
| `invalid` | `boolean` | — | from `UseEditableProps` |
| `required` | `boolean` | — | from `UseEditableProps` |
| `finalFocusEl` | `(() => HTMLElement \| null) \| undefined` | — | from `UseEditableProps` |
| `onValueChange` | `(details: EditableValueChangeDetails) => void` | — | from `UseEditableProps` |
| `onValueCommit` | `(details: EditableValueChangeDetails) => void` | — | from `UseEditableProps` |
| `onValueRevert` | `(details: EditableValueChangeDetails) => void` | — | from `UseEditableProps` |
| `onEditChange` | `(details: EditableEditChangeDetails) => void` | — | from `UseEditableProps` |
| `onFocusOutside` | `(event: EditableInteractOutsideEvent) => void` | — | from `UseEditableProps` |
| `onPointerDownOutside` | `(event: EditableInteractOutsideEvent) => void` | — | from `UseEditableProps` |
| `onInteractOutside` | `(event: EditableInteractOutsideEvent) => void` | — | from `UseEditableProps` |

### `EditableRootProvider` — `EditableRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `EditableApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Editable` | `editable` | `root` | `editable-root` |
| `EditableArea` | `editable` | `area` | `editable-area` |
| `EditableCancelTrigger` | `editable` | `cancel-trigger` | `editable-cancel-trigger` |
| `EditableControl` | `editable` | `control` | `editable-control` |
| `EditableEditTrigger` | `editable` | `edit-trigger` | `editable-edit-trigger` |
| `EditableInput` | `editable` | `input` | `editable-input` |
| `EditableLabel` | `editable` | `label` | `editable-label` |
| `EditablePreview` | `editable` | `preview` | `editable-preview` |
| `EditableRootProvider` | `editable` | `root-provider` | `editable-root-provider` |
| `EditableSubmitTrigger` | `editable` | `submit-trigger` | `editable-submit-trigger` |

Custom properties read by this family’s CSS Module:

- `--moduix-editable-area-height`

## Generated ids

- `editable:${id}`
- `editable:${id}:area`
- `editable:${id}:cancel`
- `editable:${id}:control`
- `editable:${id}:edit`
- `editable:${id}:input`
- `editable:${id}:label`
- `editable:${id}:preview`
- `editable:${id}:submit`
- `grid-area: 1 / 1 / auto / auto;${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { PropsFn } from '../../lib/internal/types';
	import {
		Editable,
		EditableArea,
		EditableControl,
		EditableControls,
		EditableEditTrigger,
		EditableInput,
		EditableLabel,
		EditablePreview
	} from 'rta-ui';

	let name = $state('Ada Lovelace');
	let commitCount = $state(0);
</script>

{#snippet asChild(merge: PropsFn<'input'>)}
	{@const merged = merge() as HTMLTextareaAttributes}
	<textarea {...merged} rows="2"></textarea>
{/snippet}

<Editable
	bind:value={name}
	activationMode="click"
	placeholder={{ preview: 'Add a name', edit: 'Type a name' }}
	maxLength={40}
	onValueCommit={() => (commitCount += 1)}
>
	<EditableLabel>Name</EditableLabel>
	<EditableArea>
		<EditablePreview />
		<EditableInput />
	</EditableArea>
	<EditableControls />
</Editable>

<p>Committed {commitCount} time{commitCount === 1 ? '' : 's'}: {name}</p>

<Editable activationMode="dblclick" submitMode="blur" defaultValue={'Line one\nLine two'} autoResize>
	<EditableLabel>Notes</EditableLabel>
	<EditableArea>
		<EditablePreview />
		<EditableInput {asChild} />
	</EditableArea>
</Editable>

<Editable defaultValue="Read only note" readOnly>
	<EditableLabel>Read only</EditableLabel>
	<EditableArea>
		<EditablePreview />
		<EditableInput />
	</EditableArea>
	<EditableControl>
		<EditableEditTrigger />
	</EditableControl>
</Editable>
```

## Behaviour covered by tests

- renders every part with moduix hooks and the Zag id set
- enters edit mode when the preview receives focus in focus mode
- shows the preview placeholder when empty and keeps both placeholders apart
- enters edit mode on click when activationMode is click
- commits on enter and reports value change then commit
- ignores enter when submitMode is none and keeps edit mode
- reverts the previous value on escape
- disables the triggers and blocks activation when disabled or readOnly
- submits on outside focus when submitMode is blur, but not on enter
- autoResize stacks preview and input in one grid cell with Zag inline styles
- asChild textarea requires the platform modifier to submit on enter
- clamps typed values to maxLength

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
