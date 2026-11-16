<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { MarqueeSide } from './marquee.state.svelte';

	export interface MarqueeEdgeProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		side: MarqueeSide;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Marquee.module.css';
	import { useMarqueeContext } from './marquee.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		side,
		...props
	}: MarqueeEdgeProps = $props();

	const api = useMarqueeContext();
	const attrs = $derived(api.edgeAttrs(side));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="marquee"
	data-part="edge"
	data-slot="marquee-edge"
	class={cn(styles.edge, className)}
>
	{@render children?.()}
</Element>
