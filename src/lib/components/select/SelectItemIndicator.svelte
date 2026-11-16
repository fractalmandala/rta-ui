<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectItemIndicatorProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { CheckIcon } from '../../internal/icons/index.js';
	import styles from './Select.module.css';
	import { useSelectContext, useSelectItemContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SelectItemIndicatorProps = $props();

	const api = useSelectContext();
	const itemProps = useSelectItemContext();
	const attrs = $derived(api.itemIndicatorAttrs(itemProps));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="item-indicator"
	data-slot="select-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<CheckIcon />
	{/if}
</Element>
