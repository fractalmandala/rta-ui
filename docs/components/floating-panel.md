---
title: FloatingPanel
component: floating-panel
description: Open a window that users can drag, resize, minimize, and maximize.
---

# FloatingPanel

Open a window that users can drag, resize, minimize, and maximize.

Port of `moduix/packages/svelte/src/components/floating-panel` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { FloatingPanel } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `FloatingPanel` | `FloatingPanel.svelte` | `—` |
| `FloatingPanelBody` | `FloatingPanelBody.svelte` | `—` |
| `FloatingPanelCloseIcon` | `FloatingPanelCloseIcon.svelte` | `—` |
| `FloatingPanelCloseTrigger` | `FloatingPanelCloseTrigger.svelte` | `—` |
| `FloatingPanelContent` | `FloatingPanelContent.svelte` | `—` |
| `FloatingPanelControl` | `FloatingPanelControl.svelte` | `—` |
| `FloatingPanelDragIndicator` | `FloatingPanelDragIndicator.svelte` | `none (aria-hidden)` |
| `FloatingPanelDragTrigger` | `FloatingPanelDragTrigger.svelte` | `—` |
| `FloatingPanelFooter` | `FloatingPanelFooter.svelte` | `—` |
| `FloatingPanelHeader` | `FloatingPanelHeader.svelte` | `—` |
| `FloatingPanelPositioner` | `FloatingPanelPositioner.svelte` | `—` |
| `FloatingPanelResizeTrigger` | `FloatingPanelResizeTrigger.svelte` | `—` |
| `FloatingPanelResizeTriggerGroup` | `FloatingPanelResizeTriggerGroup.svelte` | `—` |
| `FloatingPanelRootProvider` | `FloatingPanelRootProvider.svelte` | `—` |
| `FloatingPanelStageTrigger` | `FloatingPanelStageTrigger.svelte` | `none (aria-hidden)` |
| `FloatingPanelTitle` | `FloatingPanelTitle.svelte` | `—` |
| `FloatingPanelTrigger` | `FloatingPanelTrigger.svelte` | `—` |

`FloatingPanel`, `FloatingPanelRootProvider` render no element of their own: they create the state and provide it to the other parts.

ARIA roles rendered by this family: `dialog`, `separator`.

## Props

### `FloatingPanel` — `FloatingPanelRootProps`
adds to `UseFloatingPanelProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseFloatingPanelProps` |
| `ids` | `FloatingPanelElementIds` | — | from `UseFloatingPanelProps` |
| `translations` | `FloatingPanelIntlTranslations` | — | from `UseFloatingPanelProps` |
| `strategy` | `'absolute' \| 'fixed'` | — | from `UseFloatingPanelProps` |
| `allowOverflow` | `boolean` | — | from `UseFloatingPanelProps` |
| `open` | `boolean` | — | bindable from `UseFloatingPanelProps` |
| `defaultOpen` | `boolean` | — | from `UseFloatingPanelProps` |
| `draggable` | `boolean` | — | from `UseFloatingPanelProps` |
| `resizable` | `boolean` | — | from `UseFloatingPanelProps` |
| `size` | `FloatingPanelSize` | — | bindable from `UseFloatingPanelProps` |
| `defaultSize` | `FloatingPanelSize` | — | from `UseFloatingPanelProps` |
| `minSize` | `FloatingPanelSize` | — | from `UseFloatingPanelProps` |
| `maxSize` | `FloatingPanelSize` | — | from `UseFloatingPanelProps` |
| `position` | `FloatingPanelPoint` | — | bindable from `UseFloatingPanelProps` |
| `defaultPosition` | `FloatingPanelPoint` | — | from `UseFloatingPanelProps` |
| `getAnchorPosition` | `(details: FloatingPanelAnchorPositionDetails) => FloatingPanelPoint` | — | from `UseFloatingPanelProps` |
| `lockAspectRatio` | `boolean` | — | from `UseFloatingPanelProps` |
| `closeOnEscape` | `boolean` | — | from `UseFloatingPanelProps` |
| `getBoundaryEl` | `() => HTMLElement \| null` | — | from `UseFloatingPanelProps` |
| `initialFocusEl` | `() => HTMLElement \| null \| false` | — | from `UseFloatingPanelProps` |
| `finalFocusEl` | `() => HTMLElement \| null` | — | from `UseFloatingPanelProps` |
| `restoreFocus` | `boolean` | — | from `UseFloatingPanelProps` |
| `disabled` | `boolean` | — | from `UseFloatingPanelProps` |
| `onPositionChange` | `(details: FloatingPanelPositionChangeDetails) => void` | — | from `UseFloatingPanelProps` |
| `onPositionChangeEnd` | `(details: FloatingPanelPositionChangeDetails) => void` | — | from `UseFloatingPanelProps` |
| `onOpenChange` | `(details: FloatingPanelOpenChangeDetails) => void` | — | from `UseFloatingPanelProps` |
| `onSizeChange` | `(details: FloatingPanelSizeChangeDetails) => void` | — | from `UseFloatingPanelProps` |
| `onSizeChangeEnd` | `(details: FloatingPanelSizeChangeDetails) => void` | — | from `UseFloatingPanelProps` |
| `onStageChange` | `(details: FloatingPanelStageChangeDetails) => void` | — | from `UseFloatingPanelProps` |
| `persistRect` | `boolean` | — | from `UseFloatingPanelProps` |
| `gridSize` | `number` | — | from `UseFloatingPanelProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseFloatingPanelProps` |
| `portalled` | `boolean` | — | from `UseFloatingPanelProps` |
| `portalRef` | `FloatingPanelPortalRef` | — | from `UseFloatingPanelProps` |
| `lazyMount` | `boolean` | — | from `UseFloatingPanelProps` |
| `unmountOnExit` | `boolean` | — | from `UseFloatingPanelProps` |
| `onExitComplete` | `() => void` | — | from `UseFloatingPanelProps` |
| `children` | `Snippet` | — |  |

### `FloatingPanelResizeTrigger` — `FloatingPanelResizeTriggerProps`
accepts the native props of `Omit<HTMLProps<'div'>, 'role'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `axis` | `FloatingPanelResizeTriggerAxis` | — |  |

### `FloatingPanelResizeTriggerGroup` — `FloatingPanelResizeTriggerGroupProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `axes` | `readonly FloatingPanelResizeTriggerAxis[]` | `resizeTriggerAxes }: FloatingPanelResizeTriggerGroupProps =` |  |

### `FloatingPanelRootProvider` — `FloatingPanelRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `FloatingPanelApi` | — |  |
| `children` | `Snippet` | — |  |

### `FloatingPanelStageTrigger` — `FloatingPanelStageTriggerProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `stage` | `FloatingPanelStage` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `FloatingPanelBody` | `floating-panel` | `body` | `floating-panel-body` |
| `FloatingPanelCloseIcon` | `floating-panel` | `close-trigger` | `floating-panel-close-icon` |
| `FloatingPanelCloseTrigger` | `floating-panel` | `close-trigger` | `floating-panel-close-trigger` |
| `FloatingPanelContent` | `floating-panel` | `content` | `floating-panel-content` |
| `FloatingPanelControl` | `floating-panel` | `control` | `floating-panel-control` |
| `FloatingPanelDragIndicator` | `floating-panel` | `drag-indicator` | `floating-panel-drag-indicator` |
| `FloatingPanelDragTrigger` | `floating-panel` | `drag-trigger` | `floating-panel-drag-trigger` |
| `FloatingPanelFooter` | `floating-panel` | `footer` | `floating-panel-footer` |
| `FloatingPanelHeader` | `floating-panel` | `header` | `floating-panel-header` |
| `FloatingPanelPositioner` | `floating-panel` | `positioner` | `floating-panel-positioner` |
| `FloatingPanelResizeTrigger` | `floating-panel` | `resize-trigger` | `floating-panel-resize-trigger` |
| `FloatingPanelStageTrigger` | `floating-panel` | `stage-trigger` | `floating-panel-stage-trigger` |
| `FloatingPanelTitle` | `floating-panel` | `title` | `floating-panel-title` |
| `FloatingPanelTrigger` | `floating-panel` | `trigger` | `floating-panel-trigger` |

## Keyboard

Keys handled by this family: `PageDown`, `PageUp`, `←SpaceArrowLeft`, `↑SpaceArrowUp`, `→SpaceArrowRight`, `↓SpaceArrowDown`.

## Generated ids

- `float:${id}:content`
- `float:${id}:header`
- `float:${id}:positioner`
- `float:${id}:title`
- `float:${id}:trigger`
- `position: ${id}`
- `position: absolute; touch-action: none; ${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import FloatingPanel from '../../lib/components/floating-panel/FloatingPanel.svelte';
	import FloatingPanelBody from '../../lib/components/floating-panel/FloatingPanelBody.svelte';
	import FloatingPanelCloseIcon from '../../lib/components/floating-panel/FloatingPanelCloseIcon.svelte';
	import FloatingPanelContent from '../../lib/components/floating-panel/FloatingPanelContent.svelte';
	import FloatingPanelControl from '../../lib/components/floating-panel/FloatingPanelControl.svelte';
	import FloatingPanelDragIndicator from '../../lib/components/floating-panel/FloatingPanelDragIndicator.svelte';
	import FloatingPanelDragTrigger from '../../lib/components/floating-panel/FloatingPanelDragTrigger.svelte';
	import FloatingPanelFooter from '../../lib/components/floating-panel/FloatingPanelFooter.svelte';
	import FloatingPanelHeader from '../../lib/components/floating-panel/FloatingPanelHeader.svelte';
	import FloatingPanelPositioner from '../../lib/components/floating-panel/FloatingPanelPositioner.svelte';
	import FloatingPanelResizeTriggerGroup from '../../lib/components/floating-panel/FloatingPanelResizeTriggerGroup.svelte';
	import FloatingPanelStageTrigger from '../../lib/components/floating-panel/FloatingPanelStageTrigger.svelte';
	import FloatingPanelTitle from '../../lib/components/floating-panel/FloatingPanelTitle.svelte';
	import FloatingPanelTrigger from '../../lib/components/floating-panel/FloatingPanelTrigger.svelte';

	let open = $state(false);
</script>

<p>Open: {open ? 'yes' : 'no'}</p>

<FloatingPanel bind:open defaultPosition={{ x: 120, y: 80 }} minSize={{ width: 240, height: 160 }}>
	<FloatingPanelTrigger>Scratchpad</FloatingPanelTrigger>
	<FloatingPanelPositioner>
		<FloatingPanelContent>
			<FloatingPanelHeader>
				<FloatingPanelDragTrigger>
					<FloatingPanelDragIndicator />
				</FloatingPanelDragTrigger>
				<FloatingPanelTitle>Scratchpad</FloatingPanelTitle>
				<FloatingPanelControl>
					<FloatingPanelStageTrigger stage="minimized" />
					<FloatingPanelStageTrigger stage="maximized" />
					<FloatingPanelStageTrigger stage="default" />
					<FloatingPanelCloseIcon />
				</FloatingPanelControl>
			</FloatingPanelHeader>
			<FloatingPanelBody>
				<p>Drag the header, resize from any edge, or use the arrow keys.</p>
			</FloatingPanelBody>
			<FloatingPanelFooter>min 240 x 160</FloatingPanelFooter>
			<FloatingPanelResizeTriggerGroup />
		</FloatingPanelContent>
	</FloatingPanelPositioner>
</FloatingPanel>
```

## Behaviour covered by tests

- renders the ark contract while closed
- opens, portals the positioner and anchors the panel inside the viewport
- drags by the header through ownerDocument pointer listeners
- resizes from every axis handle and writes the aria value contract
- clamps every resize into minSize and maxSize
- moves the panel with the keyboard and closes on Escape
- keeps the rect across close and reopen only when persistRect is set
- stages the panel through the control triggers

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
