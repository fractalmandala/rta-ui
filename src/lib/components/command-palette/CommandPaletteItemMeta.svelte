<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemMetaProps
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
	}: CommandPaletteItemMetaProps = $props();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-meta"
	data-slot="command-palette-item-meta"
	class={cn(styles.itemMeta, className)}
>
	{@render children?.()}
</Element>
