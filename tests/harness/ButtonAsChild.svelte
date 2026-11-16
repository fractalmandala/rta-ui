<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import Button from '../../src/lib/components/button/Button.svelte';
  import type { PropsFn } from '../../src/lib/internal/types';

  let { disabled = false, loading = false }: { disabled?: boolean; loading?: boolean } = $props();
</script>

{#snippet asChild(merge: PropsFn<'button'>)}
  {@const merged = merge({ 'data-own': 'yes' }) as HTMLAnchorAttributes}
  <a href="#go" {...merged}>go</a>
{/snippet}

<Button {disabled} {loading} {asChild} />
