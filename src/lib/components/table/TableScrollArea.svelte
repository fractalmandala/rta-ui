<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableScrollAreaProps
    extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let { class: className, ref = $bindable(null), ...props }: TableScrollAreaProps = $props();
</script>

<Element
  as="div"
  {...props}
  bind:ref
  class={cn(styles.scrollArea, className)}
  data-scope="table"
  data-part="scroll-area"
  data-slot="table-scroll-area"
/>