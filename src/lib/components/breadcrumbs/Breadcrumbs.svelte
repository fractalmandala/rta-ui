<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import { a11yLabels } from '../../internal/a11yLabels.js';
  import styles from './Breadcrumbs.module.css';

  type Props = HTMLProps<'nav'> & PolymorphicProps<'nav'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="nav"
  aria-label={a11yLabels.breadcrumb}
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="breadcrumbs"
  data-part="root"
  data-slot="breadcrumbs-root"
/>