<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import type { InputGroupSize } from './context';

  export interface InputGroupRootProps
    extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
    size?: InputGroupSize;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import { setInputGroupSize } from './context';
  import styles from './InputGroup.module.css';

  let {
    class: className,
    ref = $bindable(null),
    size = 'md',
    ...props
  }: InputGroupRootProps = $props();

  setInputGroupSize(() => size);
</script>

<Element
  as="div"
  {...props}
  bind:ref
  class={cn(styles.root, className)}
  data-size={size}
  data-scope="input-group"
  data-part="root"
  data-slot="input-group-root"
/>