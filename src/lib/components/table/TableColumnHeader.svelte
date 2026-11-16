<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableColumnHeaderProps
    extends HTMLProps<'th'>, PolymorphicProps<'th'>, RefAttribute {
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
  }: TableColumnHeaderProps = $props();
</script>

<Element
  as="th"
  {...props}
  bind:ref
  class={cn(styles.columnHeader, numeric && styles.numeric, className)}
  data-scope="table"
  data-part="column-header"
  data-numeric={numeric || undefined}
  data-slot="table-column-header"
/>