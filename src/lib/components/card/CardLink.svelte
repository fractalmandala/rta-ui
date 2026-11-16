<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Card.module.css';

  type Props = HTMLProps<'a'> & PolymorphicProps<'a'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="a"
  {...props}
  bind:ref
  class={cn(styles.link, className)}
  data-scope="card"
  data-part="link"
  data-slot="card-link"
/>