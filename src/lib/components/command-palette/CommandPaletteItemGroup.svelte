<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemGroupProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		id?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		setCommandPaletteItemGroupContext,
		useCommandPaletteComboboxContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		id,
		ref = $bindable(null),
		...props
	}: CommandPaletteItemGroupProps = $props();

	const api = useCommandPaletteComboboxContext();
	const uid = $props.id();
	const groupId = $derived(id ?? uid);

	setCommandPaletteItemGroupContext(() => groupId);

	const attrs = $derived(api.itemGroupAttrs({ id: groupId }));
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-group"
	data-slot="command-palette-item-group"
	class={cn(styles.itemGroup, className)}
>
	{@render children?.()}
</Element>
