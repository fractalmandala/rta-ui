<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Breadcrumbs.module.css';

  type Props = HTMLProps<'li'> & PolymorphicProps<'li'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="li"
  {...props}
  bind:ref
  class={cn(styles.item, className)}
  data-slot="breadcrumbs-item"
/>