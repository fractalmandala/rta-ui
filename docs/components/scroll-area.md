---
title: ScrollArea
component: scroll-area
description: Scroll overflowing content with styled scrollbars that match the theme.
---

# ScrollArea

Scroll overflowing content with styled scrollbars that match the theme.

Port of `moduix/packages/svelte/src/components/scroll-area` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { ScrollArea } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `ScrollArea` | `ScrollArea.svelte` | `—` |
| `ScrollAreaContent` | `ScrollAreaContent.svelte` | `—` |
| `ScrollAreaCorner` | `ScrollAreaCorner.svelte` | `—` |
| `ScrollAreaRootProvider` | `ScrollAreaRootProvider.svelte` | `—` |
| `ScrollAreaScrollbar` | `ScrollAreaScrollbar.svelte` | `—` |
| `ScrollAreaThumb` | `ScrollAreaThumb.svelte` | `—` |
| `ScrollAreaViewport` | `ScrollAreaViewport.svelte` | `—` |

ARIA roles rendered by this family: `presentation`.

## Props

### `ScrollArea` — `ScrollAreaRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseScrollAreaProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseScrollAreaProps` |
| `ids` | `ScrollAreaElementIds` | — | from `UseScrollAreaProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseScrollAreaProps` |
| `getRootNode` | `() => ShadowRoot \| Document \| Node` | — | from `UseScrollAreaProps` |
| `fade` | `boolean` | `false` |  |
| `variant` | `ScrollAreaVariant` | `'hover'` |  |

### `ScrollAreaRootProvider` — `ScrollAreaRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `ScrollAreaApi` | — |  |

### `ScrollAreaScrollbar` — `ScrollAreaScrollbarProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `ScrollAreaScrollbarOptions`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `orientation` | `ScrollAreaOrientation` | `'vertical'` | from `ScrollAreaScrollbarOptions` |

### `ScrollAreaThumb` — `ScrollAreaThumbProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `ScrollAreaScrollbarOptions`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `orientation` | `ScrollAreaOrientation` | `'vertical'` | from `ScrollAreaScrollbarOptions` |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `ScrollArea` | `scroll-area` | `root` | `scroll-area-root` |
| `ScrollAreaContent` | `scroll-area` | `content` | `scroll-area-content` |
| `ScrollAreaCorner` | `scroll-area` | `corner` | `scroll-area-corner` |
| `ScrollAreaRootProvider` | `scroll-area` | `root` | `scroll-area-root-provider` |
| `ScrollAreaScrollbar` | `scroll-area` | `scrollbar` | `scroll-area-scrollbar` |
| `ScrollAreaThumb` | `scroll-area` | `thumb` | `scroll-area-thumb` |
| `ScrollAreaViewport` | `scroll-area` | `viewport` | `scroll-area-viewport` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-scroll-area-fade-size` | `var(--moduix-spacing-10)` |
| `--moduix-scroll-area-scrollbar-size` | `var(--moduix-spacing-1)` |
| `--moduix-scroll-area-thumb-bg` | `var(--moduix-border)` |

## Keyboard

Keys handled by this family: `bottom`, `left`, `right`, `top`.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		ScrollArea,
		ScrollAreaContent,
		ScrollAreaCorner,
		ScrollAreaScrollbar,
		ScrollAreaThumb,
		ScrollAreaViewport
	} from 'rta-ui';
</script>

<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr))">
	<ScrollArea fade style="height: 12rem; border: 1px solid var(--moduix-border); border-radius: 0.5rem">
		<ScrollAreaViewport>
			<ScrollAreaContent>
				<div style="padding: 1rem">
					{#each Array.from({ length: 20 }, (_, index) => index + 1) as row (row)}
						<p style="margin: 0 0 0.75rem">Row {row}</p>
					{/each}
				</div>
			</ScrollAreaContent>
		</ScrollAreaViewport>
		<ScrollAreaScrollbar orientation="vertical">
			<ScrollAreaThumb orientation="vertical" />
		</ScrollAreaScrollbar>
		<ScrollAreaCorner />
	</ScrollArea>

	<ScrollArea variant="always" style="height: 12rem; border: 1px solid var(--moduix-border); border-radius: 0.5rem">
		<ScrollAreaViewport>
			<ScrollAreaContent>
				<div style="display: flex; gap: 0.75rem; padding: 1rem; width: max-content">
					{#each Array.from({ length: 12 }, (_, index) => index + 1) as tile (tile)}
						<div
							style="width: 6rem; height: 8rem; border-radius: 0.5rem; background: var(--moduix-muted); display: grid; place-items: center"
						>
							{tile}
						</div>
					{/each}
				</div>
			</ScrollAreaContent>
		</ScrollAreaViewport>
		<ScrollAreaScrollbar orientation="horizontal">
			<ScrollAreaThumb orientation="horizontal" />
		</ScrollAreaScrollbar>
		<ScrollAreaCorner />
	</ScrollArea>
</div>
```

## Behaviour covered by tests

- renders the Ark contract
- merges consumer style with the generated style
- measures overflow and exposes thumb variables
- tracks scrolling state and side flags
- scrolls to an edge through the api
- drags the vertical thumb to scroll the viewport
- exposes per-orientation scrollbar hover state

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
