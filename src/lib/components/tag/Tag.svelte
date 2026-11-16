<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type TagVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  export type TagSize = 'sm' | 'md' | 'lg';

  export interface TagRootProps extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
    size?: TagSize;
    variant?: TagVariant;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Tag.module.css';

  let {
    class: className,
    ref = $bindable(null),
    size = 'md',
    variant = 'default',
    ...props
  }: TagRootProps = $props();
</script>

<Element
  as="span"
  {...props}
  bind:ref
  data-scope="tag"
  data-part="root"
  data-slot="tag-root"
  data-size={size}
  data-variant={variant}
  class={cn(styles.root, className)}
/>