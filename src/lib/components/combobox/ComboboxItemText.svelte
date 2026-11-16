<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxItemTextProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
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
	}: ComboboxItemTextProps = $props();

	const api = useComboboxContext();
	const itemOptions = useComboboxItemContext();
	const attrs = $derived(api.itemTextAttrs(itemOptions()));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="item-text"
	data-slot="combobox-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
