<script lang="ts">
  import type { Component as SvelteComponent } from 'svelte';

  let {
    component: Component,
    props = {},
    onRef,
  }: {
    component: SvelteComponent<any>;
    props?: Record<string, unknown>;
    onRef: (node: unknown) => void;
  } = $props();

  let node: unknown = $state(null);
  $effect(() => onRef(node));
</script>

<Component {...props} bind:ref={node} />
