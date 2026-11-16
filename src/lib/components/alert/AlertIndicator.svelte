<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Alert.module.css';

  type Props = HTMLProps<'span'> & PolymorphicProps<'span'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="span"
  aria-hidden="true"
  {...props}
  bind:ref
  class={cn(styles.indicator, className)}
  data-scope="alert"
  data-part="indicator"
  data-slot="alert-indicator"
/>