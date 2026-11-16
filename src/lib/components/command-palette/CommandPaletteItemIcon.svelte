<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemIconProps
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
	}: CommandPaletteItemIconProps = $props();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-icon"
	data-slot="command-palette-item-icon"
	class={cn(styles.itemIcon, className)}
>
	{@render children?.()}
</Element>
