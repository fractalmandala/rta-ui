<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectItemGroupLabelProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext, useSelectItemGroupContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SelectItemGroupLabelProps = $props();

	const api = useSelectContext();
	const group = useSelectItemGroupContext();
	const attrs = $derived(api.itemGroupLabelAttrs({ htmlFor: group.id }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="item-group-label"
	data-slot="select-item-group-label"
	class={cn(styles.itemGroupLabel, className)}
>
	{@render children?.()}
</Element>
