<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import Element from '../../src/lib/internal/Element.svelte';
  import type { PropsFn } from '../../src/lib/internal/types';

  let {
    as = 'button',
    onclick,
    onchild,
  }: { as?: string; onclick?: (e: MouseEvent) => void; onchild?: (e: MouseEvent) => void } =
    $props();
</script>

{#snippet asChild(merge: PropsFn<'button'>)}
  {@const merged = merge({ 'data-own': 'yes', onclick: onchild }) as HTMLAnchorAttributes}
  <a href="#composed" class="from-child" {...merged}>composed</a>
{/snippet}

<Element {as} class="from-element" data-slot="button-root" {onclick} {asChild} />
