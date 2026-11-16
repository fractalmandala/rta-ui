<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SliderControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Slider.module.css';
	import { useSliderContext } from './slider.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onpointerdown,
		ref = $bindable(null),
		...props
	}: SliderControlProps = $props();

	const api = useSliderContext();
	const attrs = $derived(api.controlAttrs());

	$effect(() => {
		api.setControlRef(ref);
		untrack(() => api.measureThumbSize());
		return () => api.setControlRef(null);
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
	data-part="control"
	data-slot="slider-control"
	class={cn(styles.control, className)}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.defaultPrevented) return;
		api.onControlPointerDown(event);
	}}
>
	{@render children?.()}
</Element>
