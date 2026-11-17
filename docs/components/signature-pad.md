---
title: SignaturePad
component: signature-pad
description: Capture a handwritten signature with a mouse, pen, or finger.
---

# SignaturePad

Capture a handwritten signature with a mouse, pen, or finger.

Port of `moduix/packages/svelte/src/components/signature-pad` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { SignaturePad } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `SignaturePad` | `SignaturePad.svelte` | `—` |
| `SignaturePadCanvas` | `SignaturePadCanvas.svelte` | `—` |
| `SignaturePadClearTrigger` | `SignaturePadClearTrigger.svelte` | `—` |
| `SignaturePadControl` | `SignaturePadControl.svelte` | `application` |
| `SignaturePadGuide` | `SignaturePadGuide.svelte` | `—` |
| `SignaturePadHiddenInput` | `SignaturePadHiddenInput.svelte` | `—` |
| `SignaturePadLabel` | `SignaturePadLabel.svelte` | `—` |
| `SignaturePadRootProvider` | `SignaturePadRootProvider.svelte` | `—` |
| `SignaturePadSegment` | `SignaturePadSegment.svelte` | `—` |

ARIA roles rendered by this family: `application`.

## Props

### `SignaturePad` — `SignaturePadRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseSignaturePadProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `defaultPaths` | `string[]` | — | from `UseSignaturePadProps` |
| `paths` | `string[]` | — | bindable from `UseSignaturePadProps` |
| `drawing` | `SignaturePadDrawingOptions` | — | from `UseSignaturePadProps` |
| `disabled` | `boolean` | — | from `UseSignaturePadProps` |
| `readOnly` | `boolean` | — | from `UseSignaturePadProps` |
| `required` | `boolean` | — | from `UseSignaturePadProps` |
| `name` | `string` | — | from `UseSignaturePadProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseSignaturePadProps` |
| `id` | `string \| null` | — | from `UseSignaturePadProps` |
| `ids` | `SignaturePadElementIds` | — | from `UseSignaturePadProps` |
| `translations` | `SignaturePadTranslations` | — | from `UseSignaturePadProps` |
| `onDraw` | `(details: SignaturePadDrawDetails) => void` | — | from `UseSignaturePadProps` |
| `onDrawEnd` | `(details: SignaturePadDrawEndDetails) => void` | — | from `UseSignaturePadProps` |

### `SignaturePadHiddenInput` — `SignaturePadHiddenInputProps`
accepts the native props of `HTMLProps<'input'>`, `PolymorphicProps<'input'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — | The submitted signature: the drawn paths joined with a space. |

### `SignaturePadRootProvider` — `SignaturePadRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `SignaturePadApi` | — | The signature pad returned by `createSignaturePad`, or a `bind:this` root that exposes one. |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `SignaturePad` | `signature-pad` | `root` | `signature-pad-root` |
| `SignaturePadClearTrigger` | `signature-pad` | `clear-trigger` | `signature-pad-clear-trigger` |
| `SignaturePadControl` | `signature-pad` | `control` | `signature-pad-control` |
| `SignaturePadGuide` | `signature-pad` | `guide` | `signature-pad-guide` |
| `SignaturePadHiddenInput` | `signature-pad` | `hidden-input` | `signature-pad-hidden-input` |
| `SignaturePadLabel` | `signature-pad` | `label` | `signature-pad-label` |
| `SignaturePadRootProvider` | `signature-pad` | `root` | `signature-pad-root-provider` |
| `SignaturePadSegment` | `signature-pad` | `segment` | `signature-pad-segment` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-signature-pad-bg` | `var(--moduix-background)` |
| `--moduix-signature-pad-border-color` | `var(--moduix-border)` |
| `--moduix-signature-pad-guide-color` | `var(--moduix-border)` |
| `--moduix-signature-pad-height` | `10rem` |
| `--moduix-signature-pad-radius` | `var(--moduix-radius-md)` |
| `--moduix-signature-pad-stroke-color` | `currentColor` |
| `--moduix-signature-pad-width` | `17.5rem` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `data:image/svg+xml;charset=utf-8,${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { Field, FieldHelperText, FieldLabel } from 'rta-ui';
	import { SignaturePad, SignaturePadCanvas, SignaturePadHiddenInput } from 'rta-ui';

	let paths = $state<string[]>([]);
	let readOnly = $state(false);
</script>

<Field {readOnly}>
	<FieldLabel>Signature</FieldLabel>
	<SignaturePad bind:paths name="signature">
		<SignaturePadCanvas />
		<SignaturePadHiddenInput value={paths.join(' ')} />
	</SignaturePad>
	<FieldHelperText>Draw with a mouse, pen or finger. Clear with the arrow button.</FieldHelperText>
</Field>

<button type="button" onclick={() => (readOnly = !readOnly)}>
	{readOnly ? 'Enable' : 'Disable'} drawing
</button>
<button type="button" onclick={() => (paths = [])}>Reset</button>
```

## Behaviour covered by tests

- renders the Ark contract
- derives every id from one uid and links the label to the hidden input
- captures a stroke from pointer moves on the owner document
- ignores pointer downs that are not a plain left click
- the clear trigger empties the pad and refocuses the control
- a read-only pad refuses strokes and hides the clear trigger
- a disabled pad leaves the control out of the tab order
- folds the surrounding field state into the pad
-  
- a field-disabled field does not disable the pad
- the composite canvas part renders the same parts
- asChild keeps every hook on a custom clear trigger
- exports the drawing as an svg data url
- rasterizes to a png through the canvas
- an empty pad exports an empty string
- the api clears and reports draws
- rejects degenerate strokes
- serializes a closed ribbon with fixed precision
- thinning narrows the ribbon for lighter pressure

## Notes

- **Parity:** accepted deviation — The hidden input is an Ark internal upstream; here it is a public part so the exported value can be submitted with a form.
  Extra slots: `signature-pad-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
