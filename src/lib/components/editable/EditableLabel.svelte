<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface EditableLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Editable.module.css';
	import { useEditableContext } from './editable.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: EditableLabelProps = $props();

	const api = useEditableContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="editable"
	data-part="label"
	data-slot="editable-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
