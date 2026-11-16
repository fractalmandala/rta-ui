<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TagsInputItemOptions } from './tags-input.state.svelte';

	export interface TagsInputItemProps
		extends TagsInputItemOptions, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './TagsInput.module.css';
	import { setTagsInputItemContext, useTagsInputContext } from './tags-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		index,
		ref = $bindable(null),
		value,
		...props
	}: TagsInputItemProps = $props();

	const api = useTagsInputContext();

	setTagsInputItemContext(() => ({ disabled, index, value }));

	const attrs = $derived(api.itemAttrs({ disabled, index, value }));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="tags-input"
	data-part="item"
	data-slot="tags-input-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
