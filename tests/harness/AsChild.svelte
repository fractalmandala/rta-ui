<script lang="ts">
  import type { Component as SvelteComponent } from 'svelte';

  let {
    component: Component,
    props = {},
  }: { component: SvelteComponent<any>; props?: Record<string, unknown> } = $props();
</script>

{#snippet asChild(merge: (own?: Record<string, unknown>) => Record<string, unknown>)}
  <a href="#composed" data-testid="composed" {...merge({ 'data-own': 'yes' })}>composed</a>
{/snippet}

<Component {...props} {asChild} />
