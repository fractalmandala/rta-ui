<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MarqueeViewportProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
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
		...props
	}: MarqueeViewportProps = $props();

	const api = useMarqueeContext();
	const attrs = $derived(api.viewportAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="marquee"
	data-part="viewport"
	data-slot="marquee-viewport"
	class={cn(styles.viewport, className)}
>
	{@render children?.()}
</Element>
