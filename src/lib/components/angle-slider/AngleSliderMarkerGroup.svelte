<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderMarkerGroupProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		children?: import('svelte').Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './AngleSlider.module.css';
	import { useAngleSliderContext } from './angle-slider.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: AngleSliderMarkerGroupProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.markerGroupAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="angle-slider"
	data-part="marker-group"
	data-slot="angle-slider-marker-group"
	class={cn(styles.markerGroup, className)}
>
	{@render children?.()}
</Element>
