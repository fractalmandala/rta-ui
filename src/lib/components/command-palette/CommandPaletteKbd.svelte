<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteKbdProps
		extends HTMLProps<'kbd'>,
			PolymorphicProps<'kbd'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import kbdStyles from '../kbd/Kbd.module.css';
	import styles from './CommandPalette.module.css';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: CommandPaletteKbdProps =
		$props();
</script>

<Element
	as="kbd"
	{...props}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="kbd"
	data-slot="command-palette-kbd"
	class={cn(kbdStyles.root, styles.kbd, className)}
>
	{@render children?.()}
</Element>
