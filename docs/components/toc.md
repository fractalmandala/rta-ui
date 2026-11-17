---
title: Toc
component: toc
description: A table of contents tracking the visible heading.
---

# Toc

A table of contents tracking the visible heading.

Port of `moduix/packages/svelte/src/components/toc` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Toc } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Toc` | `Toc.svelte` | `—` |
| `TocContent` | `TocContent.svelte` | `—` |
| `TocIndicator` | `TocIndicator.svelte` | `—` |
| `TocItem` | `TocItem.svelte` | `—` |
| `TocLink` | `TocLink.svelte` | `—` |
| `TocList` | `TocList.svelte` | `—` |
| `TocNav` | `TocNav.svelte` | `—` |
| `TocRail` | `TocRail.svelte` | `none (aria-hidden)` |
| `TocRootProvider` | `TocRootProvider.svelte` | `—` |
| `TocTitle` | `TocTitle.svelte` | `—` |

## Props

### `Toc` — `TocRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseTocProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `items` | `TocItemData[]` | — | from `UseTocProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseTocProps` |
| `id` | `string \| null` | — | from `UseTocProps` |
| `ids` | `TocElementIds` | — | from `UseTocProps` |
| `rootMargin` | `string` | — | from `UseTocProps` |
| `threshold` | `number \| number[]` | — | from `UseTocProps` |
| `scrollEl` | `() => HTMLElement \| null` | — | from `UseTocProps` |
| `autoScroll` | `boolean` | `false` | from `UseTocProps` |
| `scrollBehavior` | `ScrollBehavior` | — | from `UseTocProps` |
| `multiple` | `boolean` | — | from `UseTocProps` |
| `activeIds` | `string[]` | — | bindable from `UseTocProps` |
| `defaultActiveIds` | `string[]` | — | from `UseTocProps` |
| `onActiveChange` | `(details: TocActiveChangeDetails) => void` | — | from `UseTocProps` |
| `getRootNode` | `() => Node \| undefined` | — | from `UseTocProps` |

### `TocItem` — `TocItemProps`
accepts the native props of `HTMLProps<'li'>`, `PolymorphicProps<'li'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `item` | `TocItemData` | — |  |

### `TocNav` — `TocNavProps`
accepts the native props of `HTMLProps<'nav'>`, `PolymorphicProps<'nav'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `placement` | `'left' \| 'right'` | — |  |

### `TocRail` — `TocRailProps`
adds to `SVGAttributes<SVGSVGElement>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `depth` | `number` | — |  |
| `nextDepth` | `number` | — |  |
| `previousDepth` | `number` | — |  |
| `ref` | `SVGSVGElement \| null` | — | bindable |

### `TocRootProvider` — `TocRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `TocApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Toc` | `toc` | `root` | `toc-root` |
| `TocContent` | `—` | `—` | `toc-content` |
| `TocIndicator` | `toc` | `indicator` | `toc-indicator` |
| `TocItem` | `toc` | `item` | `toc-item` |
| `TocLink` | `toc` | `link` | `toc-link` |
| `TocList` | `toc` | `list` | `toc-list` |
| `TocNav` | `toc` | `nav` | `toc-nav` |
| `TocRail` | `—` | `—` | `toc-rail` |
| `TocRootProvider` | `toc` | `root` | `toc-root-provider` |
| `TocTitle` | `toc` | `title` | `toc-title` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `toc:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import {
		Toc,
		TocContent,
		TocIndicator,
		TocItem,
		TocLink,
		TocList,
		TocNav,
		TocTitle,
		type TocItemData
	} from 'rta-ui';

	const items: TocItemData[] = [
		{ value: 'toc-overview', depth: 2, label: 'Overview' },
		{ value: 'toc-installation', depth: 2, label: 'Installation' },
		{ value: 'toc-configuration', depth: 3, label: 'Configuration' },
		{ value: 'toc-usage', depth: 2, label: 'Usage' }
	];

	const text =
		'A table of contents keeps readers oriented in a long document. The active heading follows the page, and every link is a same-page anchor.';
</script>

<Toc {items} defaultActiveIds={['toc-overview']}>
	<TocContent>
		{#each items as item (item.value)}
			<section>
				{#if item.depth === 2}
					<h2 id={item.value}>{item.label}</h2>
				{:else}
					<h3 id={item.value}>{item.label}</h3>
				{/if}
				<p>{text}</p>
			</section>
		{/each}
	</TocContent>
	<TocNav>
		<TocTitle>On this page</TocTitle>
		<TocList>
			<TocIndicator />
			{#each items as item (item.value)}
				<TocItem {item}>
					<TocLink href={`#${item.value}`}>{item.label}</TocLink>
				</TocItem>
			{/each}
		</TocList>
	</TocNav>
</Toc>
```

## Behaviour covered by tests

- renders the Ark anatomy, ids and attributes
- renders the shorthand root and the rail hierarchy
- marks the active item, link and range hooks
- setActiveIds keeps the state, hooks and callback in sync
- writes the indicator rect of the active range to the root
- link clicks follow same-page hashes and skip other navigations
- syncs active ids from an IntersectionObserver over the headings
- autoScroll reveals the active item inside the list container

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
