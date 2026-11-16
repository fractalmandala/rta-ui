<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CollectionItem } from './listbox.state.svelte';

	export interface ListboxItemProps<T extends CollectionItem = CollectionItem>
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		item: T;
		highlightOnHover?: boolean;
	}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { setListboxItemContext, useListboxContext } from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		highlightOnHover,
		item,
		ref = $bindable(null),
		...props
	}: ListboxItemProps<T> = $props();

	const api = useListboxContext();
	const attrs = $derived(api.itemAttrs({ item, highlightOnHover }));

	setListboxItemContext({
		get item() {
			return item;
		},
		get highlightOnHover() {
			return highlightOnHover;
		}
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="item"
	data-slot="listbox-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
