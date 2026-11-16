<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RadioGroupItemControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
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
	}: RadioGroupItemControlProps = $props();

	const api = useRadioGroupContext();
	const attrs = $derived(api.itemControlAttrs(value, { disabled, invalid }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="radio-group"
	data-part="item-control"
	data-slot="radio-group-item-control"
	class={cn(styles.itemControl, className)}
>
	{@render children?.()}
</Element>
