<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface EditablePreviewProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Editable.module.css';
	import { useEditableContext } from './editable.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: EditablePreviewProps = $props();

	const api = useEditableContext();
	const attrs = $derived(api.previewAttrs());
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="editable"
	data-part="preview"
	data-slot="editable-preview"
	class={cn(styles.preview, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{api.valueText}
	{/if}
</Element>
