<svelte:options namespace="svg" />

<script lang="ts" generics="T extends keyof SvelteHTMLElements">
  import type { HTMLProps, PolymorphicProps, SvelteHTMLElements } from './types';

  type Props = HTMLProps<T> &
    PolymorphicProps<T> & {
      as: T;
      ref?: Element | null;
    };

  let { as, ref = $bindable(null), ...props }: Props = $props();
</script>

<svelte:element this={as} {...props} bind:this={ref} />
