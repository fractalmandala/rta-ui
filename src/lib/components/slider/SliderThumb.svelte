<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SliderThumbProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		/** Index of the thumb this element controls. */
		index?: number;
		/** Name of the thumb, forwarded as `data-name`. */
		name?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Slider.module.css';
	import { setSliderThumbContext, useSliderContext } from './slider.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index = 0,
		name,
		onblur,
		onfocus,
		onkeydown,
		onpointerdown,
		ref = $bindable(null),
		...props
	}: SliderThumbProps = $props();

	const api = useSliderContext();
	const attrs = $derived(api.thumbAttrs(index, { name }));

	setSliderThumbContext({
		get index() {
			return index;
		}
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="slider"
	data-part="thumb"
	data-slot="slider-thumb"
	class={cn(styles.thumb, className)}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.defaultPrevented) return;
		api.onThumbPointerDown(index, event);
	}}
	onfocus={(event) => {
		onfocus?.(event);
		if (event.defaultPrevented) return;
		api.onThumbFocus(index);
	}}
	onblur={(event) => {
		onblur?.(event);
		if (event.defaultPrevented) return;
		api.onThumbBlur();
	}}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		api.onThumbKeyDown(index, event);
	}}
>
	{@render children?.()}
</Element>
