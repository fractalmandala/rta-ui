<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseSwapProps } from './swap.state.svelte';

	export type SwapAnimation = 'fade' | 'scale' | 'rotate' | 'flip' | (string & {});

	export interface SwapRootProps
		extends UseSwapProps, HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		animation?: SwapAnimation;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Swap.module.css';
	import { createSwap, setSwapContext } from './swap.state.svelte';

	let {
		animation = 'scale',
		asChild,
		children,
		class: className,
		dir,
		id,
		ref = $bindable(null),
		swap = $bindable(false),
		...props
	}: SwapRootProps = $props();

	const api = createSwap(() => ({ dir, id, swap }));
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
	data-slot="swap-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
