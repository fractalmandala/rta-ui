<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldErrorTextProps
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
	}: FieldErrorTextProps = $props();

	const api = useFieldContext();
	const attrs = $derived(api?.errorTextAttrs() ?? {});
</script>

{#if api?.invalid}
	<Element
		as="span"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-scope="field"
		data-part="error-text"
		data-slot="field-error-text"
		class={cn(styles.errorText, className)}
	>
		{@render children?.()}
	</Element>
{/if}
