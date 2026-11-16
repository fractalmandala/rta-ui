<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableRowProps extends HTMLProps<'tr'>, PolymorphicProps<'tr'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let { class: className, ref = $bindable(null), ...props }: TableRowProps = $props();
</script>

<Element
  as="tr"
  {...props}
  bind:ref
  class={cn(styles.row, className)}
  data-scope="table"
  data-part="row"
  data-slot="table-row"
/>