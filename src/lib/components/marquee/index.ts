export { default as Marquee } from './Marquee.svelte';
export { default as MarqueeContent } from './MarqueeContent.svelte';
export { default as MarqueeEdge } from './MarqueeEdge.svelte';
export { default as MarqueeItem } from './MarqueeItem.svelte';
export { default as MarqueeRootProvider } from './MarqueeRootProvider.svelte';
export { default as MarqueeViewport } from './MarqueeViewport.svelte';

export { createMarquee, setMarqueeContext, useMarqueeContext } from './marquee.state.svelte';

export type {
	MarqueeApi,
	MarqueePauseChangeDetails,
	MarqueeSide,
	UseMarqueeProps
} from './marquee.state.svelte';
export type { MarqueeRootProps } from './Marquee.svelte';
export type { MarqueeContentProps } from './MarqueeContent.svelte';
export type { MarqueeEdgeProps } from './MarqueeEdge.svelte';
export type { MarqueeItemProps } from './MarqueeItem.svelte';
export type { MarqueeRootProviderProps } from './MarqueeRootProvider.svelte';
export type { MarqueeViewportProps } from './MarqueeViewport.svelte';
