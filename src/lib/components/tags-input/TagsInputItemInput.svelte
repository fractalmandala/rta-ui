<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TagsInputItemInputProps
		extends Omit<HTMLProps<'input'>, 'value'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './TagsInput.module.css';
	import { useTagsInputContext, useTagsInputItemContext } from './tags-input.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: TagsInputItemInputProps = $props();

	const api = useTagsInputContext();
	const item = useTagsInputItemContext();
	const state = $derived(api.itemState(item()));
	const attrs = $derived(api.itemInputAttrs(item()));

	let wasEditing = false;

	// Zag seeds the tag input with the edited value and selects it when editing starts.
	$effect(() => {
		const node = ref as HTMLInputElement | null;
		const next = state.editing ? state.editedValue : '';
		if (node && node.value !== next) node.value = next;
		if (!node || !state.editing) {
			wasEditing = state.editing;
			return;
		}
		if (wasEditing) return;
		wasEditing = true;
		node.focus();
		node.select();
	});
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="tags-input"
	data-part="item-input"
	data-slot="tags-input-item-input"
	class={cn(styles.itemInput, className)}
/>
