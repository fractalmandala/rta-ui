<script module lang="ts">
  import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

  export interface TableColumnProps
    extends HTMLProps<'col'>, PolymorphicProps<'col'>, RefAttribute {}
</script>

<script lang="ts">
  import Element from '../../internal/Element.svelte';

  let { class: className, ref = $bindable(null), ...props }: TableColumnProps = $props();
</script>

<Element
  as="col"
  {...props}
  bind:ref
  class={className}
  data-scope="table"
  data-part="column"
  data-slot="table-column"
/>