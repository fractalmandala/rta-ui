<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TagsInputItemPreviewProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './TagsInput.module.css';
	import { useTagsInputContext, useTagsInputItemContext } from './tags-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TagsInputItemPreviewProps = $props();

	const api = useTagsInputContext();
	const item = useTagsInputItemContext();
	const attrs = $derived(api.itemPreviewAttrs(item()));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="tags-input"
	data-part="item-preview"
	data-slot="tags-input-item-preview"
	class={cn(styles.itemPreview, className)}
>
	{@render children?.()}
</Element>
