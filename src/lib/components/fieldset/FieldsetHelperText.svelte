<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldsetHelperTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Fieldset.module.css';
	import { useFieldsetContext } from './fieldset.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: FieldsetHelperTextProps = $props();

	const api = useFieldsetContext();
	const attrs = $derived(api?.helperTextAttrs() ?? {});
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="fieldset"
	data-part="helper-text"
	data-slot="fieldset-helper-text"
	class={cn(styles.helperText, className)}
>
	{@render children?.()}
</Element>
