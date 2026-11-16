<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Tag.module.css';

  type Props = HTMLProps<'span'> & PolymorphicProps<'span'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="span"
  {...props}
  bind:ref
  data-scope="tag"
  data-part="end-element"
  data-slot="tag-end-element"
  class={cn(styles.endElement, className)}
/>