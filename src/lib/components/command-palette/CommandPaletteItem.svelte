<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CommandPaletteEntry } from './command-palette.state.svelte';

	export interface CommandPaletteItemProps
		extends Omit<HTMLProps<'div'>, 'item'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		item: CommandPaletteEntry;
		persistFocus?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		setCommandPaletteItemContext,
		useCommandPaletteComboboxContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		item,
		persistFocus,
		ref = $bindable(null),
		...props
	}: CommandPaletteItemProps = $props();

	const api = useCommandPaletteComboboxContext();
	setCommandPaletteItemContext(() => ({ item, persistFocus }));

	const attrs = $derived(api.itemAttrs({ item, persistFocus }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item"
	data-slot="command-palette-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
