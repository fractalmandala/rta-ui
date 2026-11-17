---
title: Table
component: table
description: Present rows of data with headers, captions, and numeric columns.
---

# Table

Present rows of data with headers, captions, and numeric columns.

Port of `moduix/packages/svelte/src/components/table` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Table } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Table` | `Table.svelte` | `—` |
| `TableBody` | `TableBody.svelte` | `—` |
| `TableCaption` | `TableCaption.svelte` | `—` |
| `TableCell` | `TableCell.svelte` | `—` |
| `TableColumn` | `TableColumn.svelte` | `—` |
| `TableColumnGroup` | `TableColumnGroup.svelte` | `—` |
| `TableColumnHeader` | `TableColumnHeader.svelte` | `—` |
| `TableEmpty` | `TableEmpty.svelte` | `—` |
| `TableFooter` | `TableFooter.svelte` | `—` |
| `TableHeader` | `TableHeader.svelte` | `—` |
| `TableRow` | `TableRow.svelte` | `—` |
| `TableScrollArea` | `TableScrollArea.svelte` | `—` |

## Props

### `Table` — `TableRootProps`
accepts the native props of `HTMLProps<'table'>`, `PolymorphicProps<'table'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `interactive` | `boolean` | `false` |  |
| `showColumnBorder` | `boolean` | `false` |  |
| `size` | `TableSize` | `'md'` |  |
| `stickyHeader` | `boolean` | `false` |  |
| `striped` | `boolean` | `false` |  |

### `TableCaption` — `TableCaptionProps`
accepts the native props of `HTMLProps<'caption'>`, `PolymorphicProps<'caption'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `side` | `'top' \| 'bottom'` | `'bottom'` |  |

### `TableCell` — `TableCellProps`
accepts the native props of `HTMLProps<'td'>`, `PolymorphicProps<'td'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `numeric` | `boolean` | `false` |  |

### `TableColumnHeader` — `TableColumnHeaderProps`
accepts the native props of `HTMLProps<'th'>`, `PolymorphicProps<'th'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `numeric` | `boolean` | `false` |  |

### `TableEmpty` — `TableEmptyProps`
accepts the native props of `HTMLProps<'td'>`, `PolymorphicProps<'td'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `colSpan` | `number` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `Table` | `table` | `root` | `table-root` |
| `TableBody` | `table` | `body` | `table-body` |
| `TableCaption` | `table` | `caption` | `table-caption` |
| `TableCell` | `table` | `cell` | `table-cell` |
| `TableColumn` | `table` | `column` | `table-column` |
| `TableColumnGroup` | `table` | `column-group` | `table-column-group` |
| `TableColumnHeader` | `table` | `column-header` | `table-column-header` |
| `TableEmpty` | `table` | `empty` | `table-empty` |
| `TableFooter` | `table` | `footer` | `table-footer` |
| `TableHeader` | `table` | `header` | `table-header` |
| `TableRow` | `table` | `row` | `table-row` |
| `TableScrollArea` | `table` | `scroll-area` | `table-scroll-area` |

### CSS variables

| variable | default |
| --- | --- |
| `--moduix-table-bg` | `var(--moduix-card)` |
| `--moduix-table-border-color` | `var(--moduix-border)` |
| `--moduix-table-cell-padding-x` | `var(--moduix-spacing-4)` |
| `--moduix-table-cell-padding-y` | `var(--moduix-spacing-3)` |
| `--moduix-table-row-bg-hover` | `var(--moduix-muted)` |

## Keyboard

No keys are intercepted: the family keeps the native keyboard behaviour of the elements it renders.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableColumnHeader,
    TableFooter,
    TableHeader,
    TableRow,
    TableScrollArea,
  } from 'rta-ui';
</script>

<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableScrollArea>
    <TableHeader>
      <TableRow>
        <TableColumnHeader>Invoice</TableColumnHeader>
        <TableColumnHeader>Status</TableColumnHeader>
        <TableColumnHeader numeric>Amount</TableColumnHeader>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>INV-001</TableCell>
        <TableCell>Paid</TableCell>
        <TableCell numeric>$250.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>INV-002</TableCell>
        <TableCell>Pending</TableCell>
        <TableCell numeric>$150.00</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan={2}>Total</TableCell>
        <TableCell numeric>$400.00</TableCell>
      </TableRow>
    </TableFooter>
  </TableScrollArea>
</Table>
```

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
