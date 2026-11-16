<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CarouselSnapAlign } from './carousel.state.svelte';

	export interface CarouselItemProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		index: number;
		snapAlign?: CarouselSnapAlign;
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
		ref = $bindable(null),
		snapAlign,
		...props
	}: CarouselItemProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.itemAttrs(index, snapAlign));

	$effect(() => {
		const node = ref;
		untrack(() => api.registerSlide(index, node));
		return () => untrack(() => api.registerSlide(index, null));
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="item"
	data-slot="carousel-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
