<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxLabelProps
		extends HTMLProps<'label'>,
			PolymorphicProps<'label'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ComboboxLabelProps = $props();

	const api = useComboboxContext();
	const attrs = $derived(api.labelAttrs());
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="label"
	data-slot="combobox-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
