<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemDescriptionProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './CommandPalette.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteItemDescriptionProps = $props();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-description"
	data-slot="command-palette-item-description"
	class={cn(styles.itemDescription, className)}
>
	{@render children?.()}
</Element>
