<script module lang="ts">
  import type { HTMLSourceAttributes } from 'svelte/elements';

  export interface ImageSourceProps extends HTMLSourceAttributes {
    ref?: HTMLSourceElement | null;
  }
</script>

<script lang="ts">
  let { class: className, ref = $bindable(null), ...props }: ImageSourceProps = $props();
</script>

<source {...props} bind:this={ref} class={className} data-slot="image-source" />
