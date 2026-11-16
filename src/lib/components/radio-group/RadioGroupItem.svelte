<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RadioGroupItemProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {
		value: string;
		disabled?: boolean;
		invalid?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './RadioGroup.module.css';
	import { useRadioGroupContext } from './radio-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		invalid,
		ref = $bindable(null),
		value,
		...props
	}: RadioGroupItemProps = $props();

	const api = useRadioGroupContext();
	const attrs = $derived(api.itemAttrs(value, { disabled, invalid }));
	const state = $derived(api.itemState(value, { disabled, invalid }));
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="radio-group"
	data-part="item"
	data-slot="radio-group-item"
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
