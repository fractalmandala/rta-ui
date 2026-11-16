<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableColumnGroupProps
    extends HTMLProps<'colgroup'>, PolymorphicProps<'colgroup'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';

  let { class: className, ref = $bindable(null), ...props }: TableColumnGroupProps = $props();
</script>

<Element
  as="colgroup"
  {...props}
  bind:ref
  class={className}
  data-scope="table"
  data-part="column-group"
  data-slot="table-column-group"
/>