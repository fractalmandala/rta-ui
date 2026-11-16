<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxItemTextProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext, useListboxItemContext } from './listbox.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: ListboxItemTextProps =
		$props();

	const api = useListboxContext();
	const itemProps = useListboxItemContext();
	const attrs = $derived(api.itemTextAttrs(itemProps));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="item-text"
	data-slot="listbox-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
