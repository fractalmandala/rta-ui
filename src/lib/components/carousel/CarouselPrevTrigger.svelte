<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselPrevTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import { ChevronLeftIcon } from '../../internal/icons/index.js';
	import styles from './Carousel.module.css';
	import { useCarouselContext } from './carousel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CarouselPrevTriggerProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.prevTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="prev-trigger"
	data-slot="carousel-prev-trigger"
	class={cn(styles.trigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<ChevronLeftIcon class={styles.icon} />
	{/if}
</Element>
