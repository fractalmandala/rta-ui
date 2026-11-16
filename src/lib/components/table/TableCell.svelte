<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableCellProps extends HTMLProps<'td'>, PolymorphicProps<'td'>, RefAttribute {
    numeric?: boolean;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let {
    class: className,
    numeric = false,
    ref = $bindable(null),
    ...props
  }: TableCellProps = $props();
</script>

<Element
  as="td"
  {...props}
  bind:ref
  class={cn(styles.cell, numeric && styles.numeric, className)}
  data-scope="table"
  data-part="cell"
  data-numeric={numeric || undefined}
  data-slot="table-cell"
/>