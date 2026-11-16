<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableHeaderProps
    extends HTMLProps<'thead'>, PolymorphicProps<'thead'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let { class: className, ref = $bindable(null), ...props }: TableHeaderProps = $props();
</script>

<Element
  as="thead"
  {...props}
  bind:ref
  class={cn(styles.header, className)}
  data-scope="table"
  data-part="header"
  data-slot="table-header"
/>