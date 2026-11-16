<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldRequiredIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		fallback?: Snippet;
	}
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
		fallback,
		ref = $bindable(null),
		...props
	}: FieldRequiredIndicatorProps = $props();

	const api = useFieldContext();
	const attrs = $derived(api?.requiredIndicatorAttrs() ?? {});
</script>

{#if api?.required}
	<Element
		as="span"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-scope="field"
		data-part="required-indicator"
		data-slot="field-required-indicator"
		class={cn(styles.requiredIndicator, className)}
	>
		{#if children}
			{@render children()}
		{:else}
			*
		{/if}
	</Element>
{:else}
	{@render fallback?.()}
{/if}
