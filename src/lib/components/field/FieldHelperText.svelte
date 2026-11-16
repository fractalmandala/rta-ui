<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldHelperTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Field.module.css';
	import { useFieldContext } from './field.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: FieldHelperTextProps = $props();

	const api = useFieldContext();
	const attrs = $derived(api?.helperTextAttrs() ?? {});
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="field"
	data-part="helper-text"
	data-slot="field-helper-text"
	class={cn(styles.helperText, className)}
>
	{@render children?.()}
</Element>
