<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TagsInputLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './TagsInput.module.css';
	import { useTagsInputContext } from './tags-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TagsInputLabelProps = $props();

	const api = useTagsInputContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="tags-input"
	data-part="label"
	data-slot="tags-input-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
