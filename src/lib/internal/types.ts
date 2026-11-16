import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { Snippet } from 'svelte';

export type HTMLTag = keyof SvelteHTMLElements;
export type HTMLProps<T extends HTMLTag> = SvelteHTMLElements[T];

/** Builds the props a composed child element should spread. */
export type PropsFn<T extends HTMLTag> = (props?: HTMLProps<T>) => HTMLAttributes<never>;

export interface RefAttribute<T extends Element = Element> {
  ref?: T | null | undefined;
}

export type PolymorphicProps<T extends HTMLTag> = {
  children?: Snippet;
  /**
   * Render a child element in place of the default element, merging its props and behavior.
   * The snippet receives a function that returns the merged props to spread.
   */
  asChild?: Snippet<[PropsFn<T>]>;
};

export type { HTMLAttributes, SvelteHTMLElements };
