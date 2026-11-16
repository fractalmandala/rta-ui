<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import type { InputGroupAddonAlign } from './context';

  export interface InputGroupAddonProps
    extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
    align?: InputGroupAddonAlign;
  }
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';
  import { cn } from '../../internal/cn.js';
  import styles from './InputGroup.module.css';

  let {
    align = 'inline',
    class: className,
    ref = $bindable(null),
    ...props
  }: InputGroupAddonProps = $props();
</script>

<Element
  as="span"
  {...props}
  bind:ref
  class={cn(styles.addon, className)}
  data-scope="input-group"
  data-part="addon"
  data-slot="input-group-addon"
  data-align={align}
/>