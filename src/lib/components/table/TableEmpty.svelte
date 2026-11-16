<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableEmptyProps extends HTMLProps<'td'>, PolymorphicProps<'td'>, RefAttribute {
    colSpan: number;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import { a11yLabels } from '../../internal/a11yLabels.js';
  import styles from './Table.module.css';
  import TableRow from './TableRow.svelte';

  let {
    children,
    class: className,
    colSpan,
    ref = $bindable(null),
    ...props
  }: TableEmptyProps = $props();
</script>

<TableRow data-empty>
  <Element
    as="td"
    {...props}
    bind:ref
    class={cn(styles.cell, styles.empty, className)}
    colspan={colSpan}
    data-scope="table"
    data-part="empty"
    data-slot="table-empty"
  >
    {#if children}
      {@render children()}
    {:else}
      {a11yLabels.noResults}
    {/if}
  </Element>
</TableRow>