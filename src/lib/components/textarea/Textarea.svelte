<script module lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  export type TextareaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  export interface TextareaRootProps extends HTMLTextareaAttributes {
    size?: TextareaSize;
    ref?: HTMLTextAreaElement | null;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Textarea.module.css';

  let {
    class: className,
    oninput,
    ref = $bindable(null),
    size = 'md',
    value = $bindable(),
    ...props
  }: TextareaRootProps = $props();
</script>

<Element
  as="textarea"
  {...props}
  bind:ref
  {value}
  oninput={(event) => {
    value = event.currentTarget.value;
    oninput?.(event);
  }}
  class={cn(styles.root, className)}
  data-scope="field"
  data-part="textarea"
  data-slot="textarea-root"
  data-size={size}
/>
