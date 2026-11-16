<script lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
  import Element from '../../internal/Element.svelte';

  type Props = HTMLProps<'li'> & PolymorphicProps<'li'> & RefAttribute;

  let { class: className, ref = $bindable(null), ...props }: Props = $props();
</script>

<Element
  as="li"
  {...props}
  bind:ref
  class={className}
  data-scope="list"
  data-part="item"
  data-slot="list-item"
/>