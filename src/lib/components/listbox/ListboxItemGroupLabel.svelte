<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxItemGroupLabelProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext, useListboxItemGroupContext } from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ListboxItemGroupLabelProps = $props();

	const api = useListboxContext();
	const group = useListboxItemGroupContext();
	const attrs = $derived(api.itemGroupLabelAttrs({ htmlFor: group.id }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="item-group-label"
	data-slot="listbox-item-group-label"
	class={cn(styles.itemGroupLabel, className)}
>
	{@render children?.()}
</Element>
