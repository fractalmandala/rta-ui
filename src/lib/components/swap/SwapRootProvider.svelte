<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SwapAnimation } from './Swap.svelte';
	import type { SwapApi } from './swap.state.svelte';

	export interface SwapRootProviderProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		value: SwapApi;
		animation?: SwapAnimation;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Swap.module.css';
	import { setSwapContext } from './swap.state.svelte';

	let {
		animation = 'scale',
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: SwapRootProviderProps = $props();

	const api = untrack(() => value);
	setSwapContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="swap"
	data-part="root"
	data-animation={animation}
	data-slot="swap-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
