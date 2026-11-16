<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AngleSliderValueTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
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
		ref = $bindable(null),
		...props
	}: AngleSliderValueTextProps = $props();

	const api = useAngleSliderContext();
	const attrs = $derived(api.valueTextAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="angle-slider"
	data-part="value-text"
	data-slot="angle-slider-value-text"
	class={cn(styles.valueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.valueAsDegree}
	{/if}
</Element>
