<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Card.module.css';

  type Props = HTMLProps<'p'> & PolymorphicProps<'p'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="p"
  {...props}
  bind:ref
  class={cn(styles.description, className)}
  data-scope="card"
  data-part="description"
  data-slot="card-description"
/>