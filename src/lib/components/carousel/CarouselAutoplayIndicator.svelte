<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselAutoplayIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		fallback?: Snippet;
	}
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
		fallback,
		ref = $bindable(null),
		...props
	}: CarouselAutoplayIndicatorProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.autoplayIndicatorAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="autoplay-indicator"
	data-slot="carousel-autoplay-indicator"
	class={cn(styles.autoplayIndicator, className)}
>
	{#if api.isPlaying}
		{#if children}
			{@render children()}
		{:else}
			{api.autoplayRemaining}s
		{/if}
	{:else if fallback}
		{@render fallback()}
	{:else if !children}
		{api.autoplayRemaining}s
	{/if}
</Element>
