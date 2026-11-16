<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CarouselApi } from './carousel.state.svelte';

	export interface CarouselRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: CarouselApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Carousel.module.css';
	import { setCarouselContext } from './carousel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: CarouselRootProviderProps = $props();

	const api = untrack(() => value);
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
	data-slot="carousel-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
