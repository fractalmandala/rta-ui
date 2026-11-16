<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderMarkerProps
		extends Omit<HTMLProps<'span'>, 'children'>,
			PolymorphicProps<'span'>,
			RefAttribute {
		value: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './AngleSlider.module.css';
	import { useAngleSliderContext } from './angle-slider.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: AngleSliderMarkerProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.markerAttrs({ value }));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="angle-slider"
	data-part="marker"
	data-slot="angle-slider-marker"
	class={cn(styles.marker, className)}
/>
