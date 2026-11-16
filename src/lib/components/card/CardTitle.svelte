<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Card.module.css';

  type Props = HTMLProps<'h3'> & PolymorphicProps<'h3'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="h3"
  {...props}
  bind:ref
  class={cn(styles.title, className)}
  data-scope="card"
  data-part="title"
  data-slot="card-title"
/>