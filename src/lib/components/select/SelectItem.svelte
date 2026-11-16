<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollectionItem } from './select.state.svelte';

	export interface SelectItemProps<T extends CollectionItem = CollectionItem>
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		item: T;
		persistFocus?: boolean;
	}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { setSelectItemContext, useSelectContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		item,
		persistFocus,
		ref = $bindable(null),
		...props
	}: SelectItemProps<T> = $props();

	const api = useSelectContext();
	const attrs = $derived(api.itemAttrs({ item, persistFocus }));

	setSelectItemContext({
		get item() {
			return item;
		},
		get persistFocus() {
			return persistFocus;
		}
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="item"
	data-slot="select-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
