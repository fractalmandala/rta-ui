<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { AngleSliderApi } from './angle-slider.state.svelte';

	export interface AngleSliderRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: AngleSliderApi;
		children?: import('svelte').Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './AngleSlider.module.css';
	import { setAngleSliderContext } from './angle-slider.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		value,
		...props
	}: AngleSliderRootProviderProps = $props();

	const api = untrack(() => value);
	setAngleSliderContext(api);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="angle-slider"
	data-part="root"
	data-slot="angle-slider-root-provider"
	class={cn(styles.root, className)}
	style={mergeStyleDeclarations(attrs.style, style)}
>
	{@render children?.()}
</Element>
