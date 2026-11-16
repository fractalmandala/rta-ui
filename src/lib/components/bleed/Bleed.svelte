<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  type BleedAmount = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type BleedInline = BleedAmount | 'full';

  export interface BleedRootProps extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
    block?: BleedAmount;
    inline?: BleedInline;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Bleed.module.css';
  let {
    block = 'none',
    class: className,
    inline = 'full',
    ref = $bindable(null),
    ...props
  }: BleedRootProps = $props();
</script>

<Element
  as="div"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="bleed"
  data-part="root"
  data-slot="bleed-root"
  data-inline={inline}
  data-block={block}
/>