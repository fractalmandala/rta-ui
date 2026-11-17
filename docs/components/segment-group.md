---
title: SegmentGroup
component: segment-group
description: Switch between a few options in a compact segmented control.
---

# SegmentGroup

Switch between a few options in a compact segmented control.

Port of `moduix/packages/svelte/src/components/segment-group` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { SegmentGroup } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `SegmentGroup` | `SegmentGroup.svelte` | `—` |
| `SegmentGroupIndicator` | `SegmentGroupIndicator.svelte` | `—` |
| `SegmentGroupItem` | `SegmentGroupItem.svelte` | `—` |
| `SegmentGroupItemControl` | `SegmentGroupItemControl.svelte` | `—` |
| `SegmentGroupItemHiddenInput` | `SegmentGroupItemHiddenInput.svelte` | `—` |
| `SegmentGroupItems` | `SegmentGroupItems.svelte` | `—` |
| `SegmentGroupItemText` | `SegmentGroupItemText.svelte` | `—` |
| `SegmentGroupLabel` | `SegmentGroupLabel.svelte` | `—` |
| `SegmentGroupRootProvider` | `SegmentGroupRootProvider.svelte` | `—` |

## Props

### `SegmentGroup` — `SegmentGroupRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseSegmentGroupProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `size` | `SegmentGroupSize` | `'md'` |  |

### `SegmentGroupItem` — `SegmentGroupItemProps`
accepts the native props of `HTMLProps<'label'>`, `PolymorphicProps<'label'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `SegmentGroupItemControl` — `SegmentGroupItemControlProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `SegmentGroupItemHiddenInput` — `SegmentGroupItemHiddenInputProps`
accepts the native props of `HTMLProps<'input'>`, `PolymorphicProps<'input'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `SegmentGroupItems` — `SegmentGroupItemsProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `items` | `readonly (string \| SegmentGroupItemOption)[]` | — |  |

### `SegmentGroupItemText` — `SegmentGroupItemTextProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `string` | — |  |
| `disabled` | `boolean` | — |  |
| `invalid` | `boolean` | — |  |

### `SegmentGroupRootProvider` — `SegmentGroupRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `SegmentGroupApi` | — |  |
| `size` | `SegmentGroupSize` | `'md'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `SegmentGroup` | `segment-group` | `root` | `segment-group-root` |
| `SegmentGroupIndicator` | `segment-group` | `indicator` | `segment-group-indicator` |
| `SegmentGroupItem` | `segment-group` | `item` | `segment-group-item` |
| `SegmentGroupItemControl` | `segment-group` | `item-control` | `segment-group-item-control` |
| `SegmentGroupItemHiddenInput` | `segment-group` | `item-hidden-input` | `segment-group-item-hidden-input` |
| `SegmentGroupItemText` | `segment-group` | `item-text` | `segment-group-item-text` |
| `SegmentGroupLabel` | `segment-group` | `label` | `segment-group-label` |
| `SegmentGroupRootProvider` | `segment-group` | `root` | `segment-group-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-segment-group-bg` | `var(--moduix-muted)` |
| `--moduix-segment-group-border-color` | `var(--moduix-border)` |
| `--moduix-segment-group-indicator-bg` | `var(--moduix-background)` |
| `--moduix-segment-group-item-color` | `var(--moduix-muted-foreground)` |
| `--moduix-segment-group-item-color-checked` | `var(--moduix-foreground)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { SegmentGroup, SegmentGroupIndicator, SegmentGroupItems } from 'rta-ui';

	const frameworks = ['React', 'Solid', 'Svelte', 'Vue'];
</script>

<SegmentGroup aria-label="Framework" defaultValue="Svelte">
	<SegmentGroupIndicator />
	<SegmentGroupItems items={frameworks} />
</SegmentGroup>
```

## Behaviour covered by tests

- renders the Ark contract
- clicking an item selects it and reports the change
- a disabled group blocks selection
- the indicator is hidden until a value is measured

## Notes

- **Parity:** accepted deviation — The item control and hidden input are Ark internals upstream; here they are public parts so native radio semantics stay reachable.
  Extra slots: `segment-group-item-control`, `segment-group-item-hidden-input`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
