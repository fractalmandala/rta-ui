<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type CardSize = 'sm' | 'md' | 'lg';
  export type CardVariant = 'elevated' | 'outline' | 'subtle';

  export interface CardRootProps extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
    size?: CardSize;
    variant?: CardVariant;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Card.module.css';
  let {
    class: className,
    ref = $bindable(null),
    size = 'md',
    variant = 'outline',
    ...props
  }: CardRootProps = $props();
</script>

<Element
  as="div"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="card"
  data-part="root"
  data-size={size}
  data-variant={variant}
  data-slot="card-root"
/>