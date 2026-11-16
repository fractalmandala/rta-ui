<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SwapIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		type: 'on' | 'off';
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Swap.module.css';
	import { useSwapContext } from './swap.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		type,
		...props
	}: SwapIndicatorProps = $props();

	const api = useSwapContext();
	const attrs = $derived(api.indicatorAttrs({ type }));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="swap"
	data-part="indicator"
	data-slot="swap-indicator"
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
