<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselItemGroupProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
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
		ref = $bindable(null),
		...props
	}: CarouselItemGroupProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.itemGroupAttrs());

	$effect(() => {
		const node = ref;
		untrack(() => api.registerItemGroup(node));
		return () => untrack(() => api.registerItemGroup(null));
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
	data-part="item-group"
	data-slot="carousel-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
