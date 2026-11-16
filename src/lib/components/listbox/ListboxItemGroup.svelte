<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxItemGroupProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		id?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { setListboxItemGroupContext, useListboxContext } from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		id,
		ref = $bindable(null),
		...props
	}: ListboxItemGroupProps = $props();

	const uid = $props.id();
	const groupId = $derived(id ?? uid);
	const api = useListboxContext();
	const attrs = $derived(api.itemGroupAttrs({ id: groupId }));

	setListboxItemGroupContext({
		get id() {
			return groupId;
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
	data-part="item-group"
	data-slot="listbox-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
