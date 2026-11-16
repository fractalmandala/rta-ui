<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableCaptionProps
    extends HTMLProps<'caption'>, PolymorphicProps<'caption'>, RefAttribute {
    side?: 'top' | 'bottom';
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let {
    class: className,
    side = 'bottom',
    ref = $bindable(null),
    ...props
  }: TableCaptionProps = $props();
</script>

<Element
  as="caption"
  {...props}
  bind:ref
  class={cn(styles.caption, className)}
  data-scope="table"
  data-part="caption"
  data-side={side}
  data-slot="table-caption"
/>