<script lang="ts" generics="T extends keyof SvelteHTMLElements">
  import { createAttachmentKey } from 'svelte/attachments';
  import type { HTMLProps, PolymorphicProps, PropsFn, SvelteHTMLElements } from './types';
  import { mergeProps } from './mergeProps';
  import SvgFactory from './SvgFactory.svelte';

  type Props = HTMLProps<T> &
    PolymorphicProps<T> & {
      as: T;
      ref?: Element | null;
    };

  let { asChild, children, as, ref = $bindable(null), ...rest }: Props = $props();

  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link'];
  const voidSvgTags = ['path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'];

  const refKey = createAttachmentKey();

  const attachRef = (node: Element) => {
    ref = node;
    return () => {
      if (ref === node) ref = null;
    };
  };

  const propsFn: PropsFn<T> = (props) => mergeProps(rest, props ?? {}, { [refKey]: attachRef });

  const isVoidHtmlTag = $derived(typeof as === 'string' && voidTags.includes(as));
  const isVoidSvgTag = $derived(typeof as === 'string' && voidSvgTags.includes(as));
</script>

{#if asChild}
  {@render asChild?.(propsFn)}
{:else if isVoidSvgTag}
  <SvgFactory {as} {...rest} bind:ref={ref as Element} />
{:else if isVoidHtmlTag}
  <svelte:element this={as as string} {...rest} bind:this={ref as Element} />
{:else if as === 'textarea'}
  <textarea {...rest} bind:this={ref as HTMLTextAreaElement}></textarea>
{:else}
  <svelte:element this={as as string} {...rest} bind:this={ref as Element}>
    {@render children?.()}
  </svelte:element>
{/if}
