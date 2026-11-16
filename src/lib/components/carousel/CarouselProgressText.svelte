<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselProgressTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
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
	}: CarouselProgressTextProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.progressTextAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="progress-text"
	data-slot="carousel-progress-text"
	class={cn(styles.progressText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.getProgressText()}
	{/if}
</Element>
