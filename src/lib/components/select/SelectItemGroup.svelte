<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectItemGroupProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		id?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { setSelectItemGroupContext, useSelectContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		id,
		ref = $bindable(null),
		...props
	}: SelectItemGroupProps = $props();

	const uid = $props.id();
	const groupId = $derived(id ?? uid);
	const api = useSelectContext();
	const attrs = $derived(api.itemGroupAttrs({ id: groupId }));

	setSelectItemGroupContext({
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
	data-scope="select"
	data-part="item-group"
	data-slot="select-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
