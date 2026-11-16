<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  export type ContainerGutter = 'none' | 'sm' | 'md' | 'lg';

  export interface ContainerRootProps
    extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
    gutter?: ContainerGutter;
    size?: ContainerSize;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Container.module.css';
  let {
    class: className,
    gutter = 'md',
    ref = $bindable(null),
    size = 'lg',
    ...props
  }: ContainerRootProps = $props();
</script>

<Element
  as="div"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="container"
  data-part="root"
  data-slot="container-root"
  data-size={size}
  data-gutter={gutter}
/>