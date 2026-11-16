<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Field.module.css';
	import { useFieldContext } from './field.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: FieldLabelProps =
		$props();

	const api = useFieldContext();
	const attrs = $derived(api?.labelAttrs() ?? {});
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="field"
	data-part="label"
	data-slot="field-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
