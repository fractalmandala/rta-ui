<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectItemTextProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext, useSelectItemContext } from './select.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SelectItemTextProps =
		$props();

	const api = useSelectContext();
	const itemProps = useSelectItemContext();
	const attrs = $derived(api.itemTextAttrs(itemProps));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="item-text"
	data-slot="select-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
