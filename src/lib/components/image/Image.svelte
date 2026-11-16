<script module lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';

  export type ImageLayout = 'fixed' | 'constrained' | 'fullWidth';

  export interface ImageRootProps extends HTMLImgAttributes {
    layout?: ImageLayout;
    priority?: boolean;
    ref?: HTMLImageElement | null;
  }
</script>

<script lang="ts">
  import { cn } from '../../internal/cn.js';
  import styles from './Image.module.css';

  let {
    class: className,
    decoding,
    fetchpriority,
    layout = 'constrained',
    loading,
    priority = false,
    ref = $bindable(null),
    ...props
  }: ImageRootProps = $props();

  const imageProps = $derived({
    ...props,
    decoding: decoding ?? undefined,
    fetchpriority: fetchpriority ?? (priority ? 'high' : undefined),
    loading: loading ?? (priority ? 'eager' : 'lazy'),
  });
</script>

<img
  {...imageProps}
  bind:this={ref}
  class={cn(styles.root, className)}
  data-layout={layout}
  data-slot="image-root"
/>
