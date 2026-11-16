<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SegmentGroupItemControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
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
	}: SegmentGroupItemControlProps = $props();

	const api = useSegmentGroupContext();
	const attrs = $derived(api.itemControlAttrs(value, { disabled, invalid }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="segment-group"
	data-part="item-control"
	data-slot="segment-group-item-control"
	class={cn(styles.itemControl, className)}
>
	{@render children?.()}
</Element>
