<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RadioGroupItemTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
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
	}: RadioGroupItemTextProps = $props();

	const api = useRadioGroupContext();
	const attrs = $derived(api.itemTextAttrs(value, { disabled, invalid }));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="radio-group"
	data-part="item-text"
	data-slot="radio-group-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
