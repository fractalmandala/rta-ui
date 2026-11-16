<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type TableSize = 'sm' | 'md' | 'lg';

  export interface TableRootProps
    extends HTMLProps<'table'>, PolymorphicProps<'table'>, RefAttribute {
    interactive?: boolean;
    showColumnBorder?: boolean;
    size?: TableSize;
    stickyHeader?: boolean;
    striped?: boolean;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Table.module.css';

  let {
    class: className,
    interactive = false,
    ref = $bindable(null),
    showColumnBorder = false,
    size = 'md',
    stickyHeader = false,
    striped = false,
    ...props
  }: TableRootProps = $props();
</script>

<Element
  as="table"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="table"
  data-part="root"
  data-interactive={interactive || undefined}
  data-show-column-border={showColumnBorder || undefined}
  data-size={size}
  data-sticky-header={stickyHeader || undefined}
  data-striped={striped || undefined}
  data-slot="table-root"
/>