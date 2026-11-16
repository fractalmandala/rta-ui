<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemTextProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		useCommandPaletteComboboxContext,
		useCommandPaletteItemContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteItemTextProps = $props();

	const api = useCommandPaletteComboboxContext();
	const getItem = useCommandPaletteItemContext();
	const attrs = $derived(api.itemTextAttrs(getItem()));
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-text"
	data-slot="command-palette-item-text"
	class={cn(styles.itemText, className)}
>
	{@render children?.()}
</Element>
