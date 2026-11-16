<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {
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
		onclick,
		ref = $bindable(null),
		...props
	}: AngleSliderLabelProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.onLabelClick(event);
	}}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="angle-slider"
	data-part="label"
	data-slot="angle-slider-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
