<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemGroupLabelProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		useCommandPaletteComboboxContext,
		useCommandPaletteItemGroupContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteItemGroupLabelProps = $props();

	const api = useCommandPaletteComboboxContext();
	const getGroupId = useCommandPaletteItemGroupContext();
	const attrs = $derived(api.itemGroupLabelAttrs({ htmlFor: getGroupId() }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-group-label"
	data-slot="command-palette-item-group-label"
	class={cn(styles.itemGroupLabel, className)}
>
	{@render children?.()}
</Element>
