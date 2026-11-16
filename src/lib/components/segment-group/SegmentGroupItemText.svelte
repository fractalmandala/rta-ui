<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SegmentGroupItemTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		value: string;
		disabled?: boolean;
		invalid?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SegmentGroup.module.css';
	import { useSegmentGroupContext } from './segment-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		invalid,
		ref = $bindable(null),
		value,
		...props
	}: SegmentGroupItemTextProps = $props();

	const api = useSegmentGroupContext();
	const attrs = $derived(api.itemTextAttrs(value, { disabled, invalid }));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="segment-group"
	data-part="item-text"
	data-slot="segment-group-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
