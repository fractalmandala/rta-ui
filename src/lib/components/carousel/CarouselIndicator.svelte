<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselIndicatorProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {
		index: number;
		readOnly?: boolean;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Carousel.module.css';
	import { useCarouselContext } from './carousel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index,
		readOnly = false,
		ref = $bindable(null),
		...props
	}: CarouselIndicatorProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.indicatorAttrs(index, readOnly));

	$effect(() => {
		const node = ref;
		untrack(() => api.registerIndicator(index, node));
		return () => untrack(() => api.registerIndicator(index, null));
	});
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="indicator"
	data-slot="carousel-indicator"
	class={cn(styles.indicator, className)}
>
	{#if children}
		{@render children()}
	{/if}
</Element>
