<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SliderMarkerProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		/** Value this marker represents on the track. */
		value: number;
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
		ref = $bindable(null),
		value,
		...props
	}: SliderMarkerProps = $props();

	const api = useSliderContext();
	const attrs = $derived(api.markerAttrs(value));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="slider"
	data-part="marker"
	data-slot="slider-marker"
	class={cn(styles.marker, className)}
>
	{@render children?.()}
</Element>
