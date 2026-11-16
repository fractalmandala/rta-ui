<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableBodyProps
    extends HTMLProps<'tbody'>, PolymorphicProps<'tbody'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let { class: className, ref = $bindable(null), ...props }: TableBodyProps = $props();
</script>

<Element
  as="tbody"
  {...props}
  bind:ref
  class={cn(styles.body, className)}
  data-scope="table"
  data-part="body"
  data-slot="table-body"
/>