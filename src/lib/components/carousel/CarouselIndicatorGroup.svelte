<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselIndicatorGroupProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Carousel.module.css';
	import { useCarouselContext } from './carousel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CarouselIndicatorGroupProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.indicatorGroupAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="indicator-group"
	data-slot="carousel-indicator-group"
	class={cn(styles.indicatorGroup, className)}
>
	{@render children?.()}
</Element>
