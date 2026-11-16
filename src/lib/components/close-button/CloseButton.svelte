<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface CloseButtonProps
    extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
    'data-disabled'?: string;
    'data-part'?: string;
    'data-scope'?: string;
    'data-slot'?: string;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import { a11yLabels } from '../../internal/a11yLabels.js';
  import { CloseIcon } from '../../internal/icons/index.js';
  import styles from './CloseButton.module.css';

  let {
    asChild,
    children,
    class: className,
    disabled,
    onclickcapture,
    ref = $bindable(null),
    type,
    'aria-disabled': ariaDisabled,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'data-disabled': dataDisabled,
    'data-part': dataPart = 'root',
    'data-scope': dataScope = 'close-button',
    'data-slot': dataSlot = 'close-button-root',
    ...props
  }: CloseButtonProps = $props();

  // A parent Element part that composes CloseButton through asChild passes its own data-disabled.
  const isDisabled = $derived(
    !!disabled || ariaDisabled === true || ariaDisabled === 'true' || dataDisabled !== undefined,
  );

  // Stopping capture also skips every bubble onclick, including the composed child.
  const handleClickCapture: CloseButtonProps['onclickcapture'] = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    onclickcapture?.(event);
  };
</script>

<Element
  as="button"
  {...props}
  bind:ref
  {asChild}
  type={asChild ? type : (type ?? 'button')}
  disabled={asChild ? undefined : disabled}
  aria-disabled={asChild && disabled ? true : ariaDisabled}
  aria-label={ariaLabel ?? (ariaLabelledBy == null ? a11yLabels.close : undefined)}
  aria-labelledby={ariaLabelledBy}
  onclickcapture={handleClickCapture}
  data-scope={dataScope}
  data-part={dataPart}
  data-slot={dataSlot}
  data-disabled={isDisabled ? (dataDisabled ?? '') : undefined}
  class={cn(styles.root, className)}
>
  {#if children}
    {@render children()}
  {:else}
    <CloseIcon />
  {/if}
</Element>