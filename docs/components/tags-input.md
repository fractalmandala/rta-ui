---
title: TagsInput
component: tags-input
description: Enter a list of short values as tags that users can edit or remove.
---

# TagsInput

Enter a list of short values as tags that users can edit or remove.

Port of `moduix/packages/svelte/src/components/tags-input` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { TagsInput } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `TagsInput` | `TagsInput.svelte` | `—` |
| `TagsInputClearTrigger` | `TagsInputClearTrigger.svelte` | `—` |
| `TagsInputControl` | `TagsInputControl.svelte` | `—` |
| `TagsInputHiddenInput` | `TagsInputHiddenInput.svelte` | `—` |
| `TagsInputInput` | `TagsInputInput.svelte` | `—` |
| `TagsInputItem` | `TagsInputItem.svelte` | `—` |
| `TagsInputItemDeleteTrigger` | `TagsInputItemDeleteTrigger.svelte` | `—` |
| `TagsInputItemInput` | `TagsInputItemInput.svelte` | `—` |
| `TagsInputItemPreview` | `TagsInputItemPreview.svelte` | `—` |
| `TagsInputItemText` | `TagsInputItemText.svelte` | `—` |
| `TagsInputItems` | `TagsInputItems.svelte` | `—` |
| `TagsInputLabel` | `TagsInputLabel.svelte` | `—` |
| `TagsInputRootProvider` | `TagsInputRootProvider.svelte` | `—` |

## Props

### `TagsInput` — `TagsInputRootProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'placeholder'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseTagsInputProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string[]` | — | bindable from `UseTagsInputProps` |
| `defaultValue` | `string[]` | — | from `UseTagsInputProps` |
| `inputValue` | `string` | — | bindable from `UseTagsInputProps` |
| `defaultInputValue` | `string` | — | from `UseTagsInputProps` |
| `onValueChange` | `(details: TagsInputValueChangeDetails) => void` | — | from `UseTagsInputProps` |
| `onInputValueChange` | `(details: TagsInputInputValueChangeDetails) => void` | — | from `UseTagsInputProps` |
| `onHighlightChange` | `(details: TagsInputHighlightChangeDetails) => void` | — | from `UseTagsInputProps` |
| `onValueInvalid` | `(details: TagsInputValidityChangeDetails) => void` | — | from `UseTagsInputProps` |
| `validate` | `(args: TagsInputValidateArgs) => boolean` | — | from `UseTagsInputProps` |
| `sanitizeValue` | `(value: string) => string` | — | from `UseTagsInputProps` |
| `allowDuplicates` | `boolean` | — | from `UseTagsInputProps` |
| `allowOverflow` | `boolean` | — | from `UseTagsInputProps` |
| `addOnPaste` | `boolean` | — | from `UseTagsInputProps` |
| `blurBehavior` | `TagsInputBlurBehavior` | — | from `UseTagsInputProps` |
| `editable` | `boolean` | — | from `UseTagsInputProps` |
| `delimiter` | `string \| RegExp` | — | from `UseTagsInputProps` |
| `max` | `number` | — | from `UseTagsInputProps` |
| `maxLength` | `number` | — | from `UseTagsInputProps` |
| `disabled` | `boolean` | — | from `UseTagsInputProps` |
| `readOnly` | `boolean` | — | from `UseTagsInputProps` |
| `invalid` | `boolean` | — | from `UseTagsInputProps` |
| `required` | `boolean` | — | from `UseTagsInputProps` |
| `name` | `string` | — | from `UseTagsInputProps` |
| `form` | `string` | — | from `UseTagsInputProps` |
| `placeholder` | `string` | — | from `UseTagsInputProps` |
| `autoFocus` | `boolean` | — | from `UseTagsInputProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseTagsInputProps` |
| `id` | `string \| null` | — | from `UseTagsInputProps` |
| `ids` | `TagsInputElementIds` | — | from `UseTagsInputProps` |
| `translations` | `Partial<TagsInputTranslations>` | — | from `UseTagsInputProps` |

### `TagsInputItem` — `TagsInputItemProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `TagsInputItemOptions`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — | from `TagsInputItemOptions` |
| `value` | `string` | — | from `TagsInputItemOptions` |
| `disabled` | `boolean` | — | from `TagsInputItemOptions` |

### `TagsInputRootProvider` — `TagsInputRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `TagsInputApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `TagsInput` | `tags-input` | `root` | `tags-input-root` |
| `TagsInputClearTrigger` | `tags-input` | `clear-trigger` | `tags-input-clear-trigger` |
| `TagsInputControl` | `tags-input` | `control` | `tags-input-control` |
| `TagsInputInput` | `tags-input` | `input` | `tags-input-input` |
| `TagsInputItem` | `tags-input` | `item` | `tags-input-item` |
| `TagsInputItemDeleteTrigger` | `tags-input` | `item-delete-trigger` | `tags-input-item-delete-trigger` |
| `TagsInputItemInput` | `tags-input` | `item-input` | `tags-input-item-input` |
| `TagsInputItemPreview` | `tags-input` | `item-preview` | `tags-input-item-preview` |
| `TagsInputItemText` | `tags-input` | `item-text` | `tags-input-item-text` |
| `TagsInputLabel` | `tags-input` | `label` | `tags-input-label` |
| `TagsInputRootProvider` | `tags-input` | `root` | `tags-input-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-tags-input-min-height` | `var(--moduix-size-md)` |
| `--moduix-tags-input-radius` | `var(--moduix-radius-md)` |
| `--moduix-tags-input-width` | `24rem` |

## Keyboard

Keys handled by this family: `Backspace`, `Delete`, `Enter`, `Escape`, `←SpaceArrowLeft`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `tags-input:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		TagsInput,
		TagsInputClearTrigger,
		TagsInputControl,
		TagsInputHiddenInput,
		TagsInputInput,
		TagsInputItems,
		TagsInputLabel
	} from 'rta-ui';

	let value = $state<string[]>(['design', 'svelte']);
	let inputValue = $state('');
</script>

<p>Values: {value.join(', ') || '—'} — typing: {inputValue || '—'}</p>

<TagsInput bind:value bind:inputValue placeholder="Add a topic" blurBehavior="add">
	<TagsInputLabel>Topics</TagsInputLabel>
	<TagsInputControl>
		<TagsInputItems />
		<TagsInputInput />
		<TagsInputClearTrigger />
	</TagsInputControl>
	<TagsInputHiddenInput name="topics" />
</TagsInput>
```

## Behaviour covered by tests

- renders every anatomy part with scope, part and slot hooks
- commits a tag on Enter or the delimiter and trims through sanitizeValue
- commits or clears the draft on blur through blurBehavior
- walks tags with the arrow keys, deletes the highlighted one and escapes to the input
- removes the previous tag on the second Backspace and keeps the next one highlighted
- removes a tag with its trigger and all of them with the clear trigger
- edits a tag inline, saving with Enter, cancelling with Escape and dropping an empty value
- rejects duplicates, invalid and overflowing tags unless the props allow them
- marks the root invalid when the value overflows max
- splits pasted values when addOnPaste is set
- mirrors the joined value into the hidden input and fires an input event
- reflects disabled and readonly on the input, control and hidden input
- folds the field context into required, invalid and described-by props

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
