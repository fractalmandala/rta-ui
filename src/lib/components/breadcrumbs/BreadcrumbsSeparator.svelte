<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import { ChevronRightIcon } from '../../internal/icons/index.js';
  import styles from './Breadcrumbs.module.css';

  type Props = HTMLProps<'li'> & PolymorphicProps<'li'> & RefAttribute;

  let { asChild, children, class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="li"
  {...props}
  bind:ref
  {asChild}
  class={cn(styles.separator, className)}
  aria-hidden="true"
  data-slot="breadcrumbs-separator"
>
  {#if children}
    {@render children()}
  {:else if !asChild}
    <ChevronRightIcon class={styles.separatorIcon} />
  {/if}
</Element>