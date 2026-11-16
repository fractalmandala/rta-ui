<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxListProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
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
	}: ComboboxListProps = $props();

	const api = useComboboxContext();
	const attrs = $derived(api.listAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="list"
	data-slot="combobox-list"
	class={cn(styles.list, className)}
>
	{@render children?.()}
</Element>
