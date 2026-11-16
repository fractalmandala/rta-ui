<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Kbd.module.css';

  type Props = HTMLProps<'kbd'> & PolymorphicProps<'kbd'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="kbd"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="kbd"
  data-part="root"
  data-slot="kbd-root"
/>