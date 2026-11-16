<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxItemGroupLabelProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		htmlFor?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { useComboboxContext, useComboboxItemGroupContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		htmlFor,
		ref = $bindable(null),
		...props
	}: ComboboxItemGroupLabelProps = $props();

	const api = useComboboxContext();
	const group = useComboboxItemGroupContext();
	const attrs = $derived(api.itemGroupLabelAttrs({ htmlFor: htmlFor ?? group.id }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="item-group-label"
	data-slot="combobox-item-group-label"
	class={cn(styles.itemGroupLabel, className)}
>
	{@render children?.()}
</Element>
