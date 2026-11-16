<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Breadcrumbs.module.css';

  type Props = HTMLProps<'ol'> & PolymorphicProps<'ol'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="ol"
  {...props}
  bind:ref
  class={cn(styles.list, className)}
  data-slot="breadcrumbs-list"
/>