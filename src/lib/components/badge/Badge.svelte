<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type BadgeSize = 'sm' | 'md' | 'lg';
  export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

  export interface BadgeRootProps
    extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
    size?: BadgeSize;
    variant?: BadgeVariant;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Badge.module.css';
  let {
    class: className,
    ref = $bindable(null),
    size = 'md',
    variant = 'default',
    ...props
  }: BadgeRootProps = $props();
</script>

<Element
  as="span"
  {...props}
  bind:ref
  data-scope="badge"
  data-part="root"
  data-slot="badge-root"
  data-size={size}
  data-variant={variant}
  class={cn(styles.root, className)}
/>