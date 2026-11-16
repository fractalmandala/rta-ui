<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableFooterProps
    extends HTMLProps<'tfoot'>, PolymorphicProps<'tfoot'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let { class: className, ref = $bindable(null), ...props }: TableFooterProps = $props();
</script>

<Element
  as="tfoot"
  {...props}
  bind:ref
  class={cn(styles.footer, className)}
  data-scope="table"
  data-part="footer"
  data-slot="table-footer"
/>