<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type TypesetScrollProps = HTMLProps<'div'> & PolymorphicProps<'div'> & RefAttribute;
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Typeset.module.css';
  let {
    class: className,
    ref = $bindable(null),
    role,
    tabindex = 0,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
  }: TypesetScrollProps = $props();

  const resolvedRole = $derived(role ?? (ariaLabel || ariaLabelledby ? 'region' : undefined));
</script>

<Element
  as="div"
  {...props}
  bind:ref
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  class={cn(styles.scroll, className)}
  role={resolvedRole}
  {tabindex}
  data-scope="typeset"
  data-part="scroll"
  data-slot="typeset-scroll"
/>