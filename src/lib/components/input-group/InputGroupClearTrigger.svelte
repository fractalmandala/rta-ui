<script module lang="ts">
  import type { CloseButtonProps } from '../close-button/CloseButton.svelte';
  import type { InputGroupSize } from './context';

  export interface InputGroupClearTriggerProps extends CloseButtonProps {
    size?: InputGroupSize;
  }
</script>

<script lang="ts">
  import { cn } from '../../internal/cn.js';
  import { a11yLabels } from '../../internal/a11yLabels.js';
  import CloseButton from '../close-button/CloseButton.svelte';
  import { useInputGroupSize } from './context';
  import styles from './InputGroup.module.css';

  let {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    class: className,
    ref = $bindable(null),
    size,
    type = 'button',
    ...props
  }: InputGroupClearTriggerProps = $props();

  const groupSize = useInputGroupSize();
  const buttonSize = $derived(size ?? groupSize());
</script>

<CloseButton
  {...props}
  bind:ref
  class={cn(styles.clearTrigger, className)}
  data-size={buttonSize}
  {type}
  aria-label={ariaLabel ?? (ariaLabelledby == null ? a11yLabels.clearInput : undefined)}
  aria-labelledby={ariaLabelledby}
  data-scope="input-group"
  data-part="clear-trigger"
  data-slot="input-group-clear-trigger"
/>