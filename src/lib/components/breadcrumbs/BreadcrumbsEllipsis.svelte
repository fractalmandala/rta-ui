<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import { EllipsisIcon } from '../../internal/icons/index.js';
  import styles from './Breadcrumbs.module.css';

  type Props = HTMLProps<'span'> & PolymorphicProps<'span'> & RefAttribute;

  let { asChild, children, class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="span"
  {...props}
  bind:ref
  {asChild}
  class={cn(styles.ellipsis, className)}
  aria-hidden="true"
  data-slot="breadcrumbs-ellipsis"
>
  {#if children}
    {@render children()}
  {:else if !asChild}
    <EllipsisIcon class={styles.ellipsisIcon} />
  {/if}
</Element>