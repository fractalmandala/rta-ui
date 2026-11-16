<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SliderDraggingIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		/** Index of the thumb the indicator follows. */
		index?: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Slider.module.css';
	import { useSliderContext } from './slider.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index = 0,
		ref = $bindable(null),
		...props
	}: SliderDraggingIndicatorProps = $props();

	const api = useSliderContext();
	const attrs = $derived(api.draggingIndicatorAttrs(index));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="slider"
	data-part="dragging-indicator"
	data-slot="slider-dragging-indicator"
	class={cn(styles.draggingIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.value[index]}
	{/if}
</Element>
