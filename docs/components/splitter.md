---
title: Splitter
component: splitter
description: Split a layout into panels that users resize by dragging a handle.
---

# Splitter

Split a layout into panels that users resize by dragging a handle.

Port of `moduix/packages/svelte/src/components/splitter` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Splitter } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Splitter` | `Splitter.svelte` | `—` |
| `SplitterPanel` | `SplitterPanel.svelte` | `—` |
| `SplitterResizeTrigger` | `SplitterResizeTrigger.svelte` | `—` |
| `SplitterResizeTriggerIndicator` | `SplitterResizeTriggerIndicator.svelte` | `—` |
| `SplitterRootProvider` | `SplitterRootProvider.svelte` | `—` |

ARIA roles rendered by this family: `separator`.

## Props

### `Splitter` — `SplitterRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `Omit<UseSplitterProps, 'size'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `panels` | `SplitterPanelData[]` | — | from `UseSplitterProps` |
| `defaultSize` | `Array<number \| string>` | — | from `UseSplitterProps` |
| `size` | `Array<number \| string>` | — | bindable from `UseSplitterProps` |
| `orientation` | `'horizontal' \| 'vertical'` | — | from `UseSplitterProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseSplitterProps` |
| `keyboardResizeBy` | `number` | — | from `UseSplitterProps` |
| `id` | `string \| null` | — | from `UseSplitterProps` |
| `onResize` | `(details: SplitterResizeDetails) => void` | — | from `UseSplitterProps` |
| `onResizeStart` | `() => void` | — | from `UseSplitterProps` |
| `onResizeEnd` | `(details: SplitterResizeDetails) => void` | — | from `UseSplitterProps` |
| `onCollapse` | `(details: SplitterExpandCollapseDetails) => void` | — | from `UseSplitterProps` |
| `onExpand` | `(details: SplitterExpandCollapseDetails) => void` | — | from `UseSplitterProps` |

### `SplitterPanel` — `SplitterPanelProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | — |  |

### `SplitterResizeTrigger` — `SplitterResizeTriggerProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id' | 'type'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | `''` |  |
| `disabled` | `boolean` | `false` |  |

### `SplitterResizeTriggerIndicator` — `SplitterResizeTriggerIndicatorProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'id'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string` | `''` |  |
| `disabled` | `boolean` | `false` |  |

### `SplitterRootProvider` — `SplitterRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `SplitterApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Splitter` | `splitter` | `root` | `splitter-root` |
| `SplitterPanel` | `splitter` | `panel` | `splitter-panel` |
| `SplitterResizeTrigger` | `splitter` | `resize-trigger` | `splitter-resize-trigger` |
| `SplitterResizeTriggerIndicator` | `splitter` | `resize-trigger-indicator` | `splitter-resize-trigger-indicator` |
| `SplitterRootProvider` | `splitter` | `root` | `splitter-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-splitter-resize-trigger-line-color` | `var(--moduix-border)` |
| `--moduix-splitter-resize-trigger-size` | `var(--moduix-spacing-2-5)` |

## Keyboard

Keys handled by this family: `Enter`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `flex-grow: ${id}`
- `splitter:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { Splitter, SplitterPanel, SplitterResizeTrigger } from 'rta-ui';

	const panels = [
		{ id: 'a', minSize: 20 },
		{ id: 'b', minSize: 20 }
	];
</script>

<div style="height: 12rem">
	<Splitter {panels} defaultSize={[40, 60]}>
		<SplitterPanel id="a">A</SplitterPanel>
		<SplitterResizeTrigger id="a:b" aria-label="Resize panels" />
		<SplitterPanel id="b">B</SplitterPanel>
	</Splitter>
</div>
```

## Behaviour covered by tests

- renders the Ark contract
- respects explicit sizes and vertical orientation
- pointer drag resizes both panels
- keyboard resizing moves size between panels

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
