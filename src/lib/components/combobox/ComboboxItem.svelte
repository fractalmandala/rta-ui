<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ComboboxEntry } from './combobox.state.svelte';

	export interface ComboboxItemProps
		extends Omit<HTMLProps<'div'>, 'item'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		item: ComboboxEntry;
		persistFocus?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { setComboboxItemContext, useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		item,
		persistFocus,
		ref = $bindable(null),
		...props
	}: ComboboxItemProps = $props();

	const api = useComboboxContext();
	setComboboxItemContext(() => ({ item, persistFocus }));

	const attrs = $derived(api.itemAttrs({ item, persistFocus }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="item"
	data-slot="combobox-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
