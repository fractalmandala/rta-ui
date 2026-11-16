<script module lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  export interface InputRootProps extends Omit<HTMLInputAttributes, 'size'> {
    /** Native `size` attribute, which the `size` prop shadows for the token scale. */
    htmlSize?: number;
    size?: InputSize;
    ref?: HTMLInputElement | null;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Input.module.css';

  let {
    class: className,
    htmlSize,
    oninput,
    ref = $bindable(null),
    size = 'md',
    value = $bindable(),
    ...props
  }: InputRootProps = $props();
</script>

<Element
  as="input"
  {...props}
  bind:ref
  {value}
  oninput={(event) => {
    value = event.currentTarget.value;
    oninput?.(event);
  }}
  size={htmlSize}
  class={cn(styles.root, className)}
  data-scope="field"
  data-part="input"
  data-slot="input-root"
  data-size={size}
/>
