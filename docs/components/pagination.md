---
title: Pagination
component: pagination
description: Move through pages of a list, table, or search results.
---

# Pagination

Move through pages of a list, table, or search results.

Port of `moduix/packages/svelte/src/components/pagination` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Pagination } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Pagination` | `Pagination.svelte` | `—` |
| `PaginationEllipsis` | `PaginationEllipsis.svelte` | `none (aria-hidden)` |
| `PaginationFirstTrigger` | `PaginationFirstTrigger.svelte` | `none (aria-hidden)` |
| `PaginationItem` | `PaginationItem.svelte` | `—` |
| `PaginationItems` | `PaginationItems.svelte` | `—` |
| `PaginationLastTrigger` | `PaginationLastTrigger.svelte` | `none (aria-hidden)` |
| `PaginationNextTrigger` | `PaginationNextTrigger.svelte` | `—` |
| `PaginationPrevTrigger` | `PaginationPrevTrigger.svelte` | `—` |
| `PaginationRootProvider` | `PaginationRootProvider.svelte` | `—` |

ARIA roles rendered by this family: `link`.

## Props

### `Pagination` — `PaginationRootProps`
accepts the native props of `HTMLProps<'nav'>`, `PolymorphicProps<'nav'>`, `RefAttribute`, and adds to `UsePaginationProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `count` | `number` | — | from `UsePaginationProps` |
| `page` | `number` | — | bindable from `UsePaginationProps` |
| `defaultPage` | `number` | — | from `UsePaginationProps` |
| `pageSize` | `number` | — | bindable from `UsePaginationProps` |
| `defaultPageSize` | `number` | — | from `UsePaginationProps` |
| `siblingCount` | `number` | — | from `UsePaginationProps` |
| `boundaryCount` | `number` | — | from `UsePaginationProps` |
| `type` | `'button' \| 'link'` | — | from `UsePaginationProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UsePaginationProps` |
| `id` | `string \| null` | — | from `UsePaginationProps` |
| `getPageUrl` | `(details: PaginationPageUrlDetails) => string` | — | from `UsePaginationProps` |
| `onPageChange` | `(details: PaginationPageChangeDetails) => void` | — | from `UsePaginationProps` |
| `onPageSizeChange` | `(details: PaginationPageSizeChangeDetails) => void` | — | from `UsePaginationProps` |
| `translations` | `PaginationTranslations` | — | from `UsePaginationProps` |

### `PaginationEllipsis` — `PaginationEllipsisProps`
accepts the native props of `HTMLProps<'span'>`, `PolymorphicProps<'span'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `index` | `number` | — |  |

### `PaginationItem` — `PaginationItemProps`
accepts the native props of `Omit<HTMLProps<'button'>, 'type'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `number` | — |  |
| `type` | `'page'` | — |  |

### `PaginationRootProvider` — `PaginationRootProviderProps`
accepts the native props of `HTMLProps<'nav'>`, `PolymorphicProps<'nav'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `PaginationApi` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Pagination` | `pagination` | `root` | `pagination-root` |
| `PaginationEllipsis` | `pagination` | `ellipsis` | `pagination-ellipsis` |
| `PaginationFirstTrigger` | `pagination` | `first-trigger` | `pagination-first-trigger` |
| `PaginationItem` | `pagination` | `item` | `pagination-item` |
| `PaginationLastTrigger` | `pagination` | `last-trigger` | `pagination-last-trigger` |
| `PaginationNextTrigger` | `pagination` | `next-trigger` | `pagination-next-trigger` |
| `PaginationPrevTrigger` | `pagination` | `prev-trigger` | `pagination-prev-trigger` |
| `PaginationRootProvider` | `pagination` | `root` | `pagination-root-provider` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-pagination-item-size` | `var(--moduix-size-md)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Generated ids

- `pagination:${id}`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import { Pagination, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from 'rta-ui';
</script>

<Pagination count={200} pageSize={10} siblingCount={2}>
	<PaginationPrevTrigger />
	<PaginationItems />
	<PaginationNextTrigger />
</Pagination>
```

## Behaviour covered by tests

- renders the Ark contract
- clicking a page reports the change and moves the selection
- triggers respect the first and last page bounds
- collapses a single skipped page into its number

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
