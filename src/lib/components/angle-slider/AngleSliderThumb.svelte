<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderThumbProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		children?: import('svelte').Snippet;
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
		children,
		class: className,
		onkeydown,
		ref = $bindable(null),
		...props
	}: AngleSliderThumbProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.thumbAttrs());

	$effect(() => {
		api.setThumbRef(ref);
		return () => api.setThumbRef(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="angle-slider"
	data-part="thumb"
	data-slot="angle-slider-thumb"
	class={cn(styles.thumb, className)}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		api.onThumbKeyDown(event);
	}}
>
	{@render children?.()}
</Element>
