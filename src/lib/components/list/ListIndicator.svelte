<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './List.module.css';

  type Props = HTMLProps<'span'> & PolymorphicProps<'span'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="span"
  {...props}
  bind:ref
  class={cn(styles.indicator, className)}
  data-scope="list"
  data-part="indicator"
  data-slot="list-indicator"
/>