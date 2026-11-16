<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxItemIndicatorProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { CheckIcon } from '../../internal/icons/index.js';
	import styles from './Listbox.module.css';
	import { useListboxContext, useListboxItemContext } from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ListboxItemIndicatorProps = $props();

	const api = useListboxContext();
	const itemProps = useListboxItemContext();
	const attrs = $derived(api.itemIndicatorAttrs(itemProps));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="item-indicator"
	data-slot="listbox-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<CheckIcon />
	{/if}
</Element>
