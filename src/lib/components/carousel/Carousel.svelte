<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseCarouselProps } from './carousel.state.svelte';

	export interface CarouselRootProps
		extends UseCarouselProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Carousel.module.css';
	import { createCarousel, setCarouselContext } from './carousel.state.svelte';

	let {
		allowMouseDrag,
		asChild,
		autoplay,
		autoSize,
		children,
		class: className,
		defaultPage,
		dir,
		getRootNode,
		id,
		ids,
		inViewThreshold,
		loop,
		onAutoplayStatusChange,
		onDragStatusChange,
		onPageChange,
		orientation,
		padding,
		page = $bindable(),
		pauseOnHover,
		ref = $bindable(null),
		slideCount,
		slidesPerMove,
		slidesPerPage,
		snapType,
		spacing,
		threshold,
		translations,
		...props
	}: CarouselRootProps = $props();

	const uid = $props.id();
	const api = createCarousel(
		() => ({
			allowMouseDrag,
			autoplay,
			autoSize,
			defaultPage,
			dir,
			getRootNode,
			id,
			ids,
			inViewThreshold,
			loop,
			orientation,
			padding,
			page,
			pauseOnHover,
			slideCount,
			slidesPerMove,
			slidesPerPage,
			snapType,
			spacing,
			threshold,
			translations,
			onAutoplayStatusChange,
			onDragStatusChange,
			onPageChange(details) {
				onPageChange?.(details);
				page = details.page;
			}
		}),
		uid
	);
	setCarouselContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="root"
	data-slot="carousel-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
