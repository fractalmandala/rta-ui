<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CarouselNextTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import { ChevronRightIcon } from '../../internal/icons/index.js';
	import styles from './Carousel.module.css';
	import { useCarouselContext } from './carousel.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CarouselNextTriggerProps = $props();

	const api = useCarouselContext();
	const attrs = $derived(api.nextTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="carousel"
	data-part="next-trigger"
	data-slot="carousel-next-trigger"
	class={cn(styles.trigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
		<ChevronRightIcon class={styles.icon} />
	{/if}
</Element>
