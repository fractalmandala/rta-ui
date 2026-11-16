<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SliderMarkerGroupProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
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
		ref = $bindable(null),
		...props
	}: SliderMarkerGroupProps = $props();

	const api = useSliderContext();
	const attrs = $derived(api.markerGroupAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="slider"
	data-part="marker-group"
	data-slot="slider-marker-group"
	class={cn(styles.markerGroup, className)}
>
	{@render children?.()}
</Element>
