<script lang="ts">
  import { cn } from '../../internal/cn.js';
  import { a11yLabels } from '../../internal/a11yLabels.js';
  import CloseButton, { type CloseButtonProps } from '../close-button/CloseButton.svelte';
  import styles from './Tag.module.css';

  let {
    children,
    class: className,
    ref = $bindable(null),
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...props
  }: CloseButtonProps = $props();
</script>

<CloseButton
  {...props}
  bind:ref
  aria-label={ariaLabel ?? (ariaLabelledBy == null ? a11yLabels.closeTag : undefined)}
  aria-labelledby={ariaLabelledBy}
  data-scope="tag"
  data-part="close-trigger"
  data-slot="tag-close-trigger"
  class={cn(styles.closeTrigger, className)}
  {children}
/>