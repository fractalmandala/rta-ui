<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderControlProps
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
		onpointerdown,
		ref = $bindable(null),
		...props
	}: AngleSliderControlProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.controlAttrs());

	$effect(() => {
		api.setControlRef(ref);
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
	data-scope="angle-slider"
	data-part="control"
	data-slot="angle-slider-control"
	class={cn(styles.control, className)}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.defaultPrevented) return;
		api.onControlPointerDown(event);
	}}
>
	{@render children?.()}
</Element>
