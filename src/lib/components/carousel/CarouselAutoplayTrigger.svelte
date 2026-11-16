<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselAutoplayTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
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
	}: CarouselAutoplayTriggerProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.autoplayTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="autoplay-trigger"
	data-slot="carousel-autoplay-trigger"
	class={cn(styles.trigger, styles.autoplayTrigger, className)}
>
	{@render children?.()}
</Element>
