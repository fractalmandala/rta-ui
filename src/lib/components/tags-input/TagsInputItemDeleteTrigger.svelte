<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TagsInputItemDeleteTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { CloseIcon } from '../../internal/icons/index.js';
	import styles from './TagsInput.module.css';
	import { useTagsInputContext, useTagsInputItemContext } from './tags-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TagsInputItemDeleteTriggerProps = $props();

	const api = useTagsInputContext();
	const item = useTagsInputItemContext();
	const attrs = $derived(api.itemDeleteTriggerAttrs(item()));
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="tags-input"
	data-part="item-delete-trigger"
	data-slot="tags-input-item-delete-trigger"
	class={cn(styles.itemDeleteTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<CloseIcon />
	{/if}
</Element>
