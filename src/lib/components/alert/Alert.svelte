<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export type AlertStatus = 'info' | 'success' | 'warning' | 'error';

  export interface AlertRootProps extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
    status?: AlertStatus;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './Alert.module.css';
  let {
    class: className,
    ref = $bindable(null),
    status = 'info',
    ...props
  }: AlertRootProps = $props();
</script>

<Element
  as="div"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-scope="alert"
  data-part="root"
  data-status={status}
  data-slot="alert-root"
/>