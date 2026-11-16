<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Alert.module.css';

  type Props = HTMLProps<'p'> & PolymorphicProps<'p'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="p"
  {...props}
  bind:ref
  class={cn(styles.title, className)}
  data-scope="alert"
  data-part="title"
  data-slot="alert-title"
/>