<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TagsInputInputProps
		extends Omit<HTMLProps<'input'>, 'value'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './TagsInput.module.css';
	import { useTagsInputContext } from './tags-input.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: TagsInputInputProps = $props();

	const api = useTagsInputContext();
	const attrs = $derived(api.inputAttrs());

	$effect(() => {
		api.registerInput(ref as HTMLInputElement | null);
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
	data-part="input"
	data-slot="tags-input-input"
	class={cn(styles.input, className)}
/>
