<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SliderApi } from './slider.state.svelte';

	export interface SliderRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: SliderApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Slider.module.css';
	import { setSliderContext } from './slider.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: SliderRootProviderProps = $props();

	const api = untrack(() => value);
	setSliderContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="slider"
	data-part="root"
	data-slot="slider-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
