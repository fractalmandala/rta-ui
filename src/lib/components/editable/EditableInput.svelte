<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface EditableInputProps
		extends Omit<HTMLProps<'input'>, 'value'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Editable.module.css';
	import { useEditableContext } from './editable.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: EditableInputProps = $props();

	const api = useEditableContext();
	const attrs = $derived(api.inputAttrs());
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="editable"
	data-part="input"
	data-slot="editable-input"
	class={cn(styles.input, className)}
/>
