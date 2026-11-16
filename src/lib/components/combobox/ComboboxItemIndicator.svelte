<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxItemIndicatorProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import { CheckIcon } from '../../internal/icons/index.js';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { useComboboxContext, useComboboxItemContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ComboboxItemIndicatorProps = $props();

	const api = useComboboxContext();
	const itemOptions = useComboboxItemContext();
	const attrs = $derived(api.itemIndicatorAttrs(itemOptions()));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="item-indicator"
	data-slot="combobox-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<CheckIcon />
	{/if}
</Element>
