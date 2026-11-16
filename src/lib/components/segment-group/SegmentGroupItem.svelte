<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SegmentGroupItemProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {
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
	}: SegmentGroupItemProps = $props();

	const api = useSegmentGroupContext();
	const attrs = $derived(api.itemAttrs(value, { disabled, invalid }));
	const state = $derived(api.itemState(value, { disabled, invalid }));
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="segment-group"
	data-part="item"
	data-slot="segment-group-item"
	onpointermove={() => {
		if (state.disabled || state.hovered) return;
		api.setHovered(value);
	}}
	onpointerleave={() => {
		if (state.disabled) return;
		api.setHovered(null);
	}}
	onpointerdown={() => {
		if (state.disabled) return;
		api.setActive(value);
	}}
	onpointerup={() => {
		if (state.disabled) return;
		api.setActive(null);
	}}
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
