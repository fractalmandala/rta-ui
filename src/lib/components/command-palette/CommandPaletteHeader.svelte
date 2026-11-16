<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteHeaderProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
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
	}: CommandPaletteHeaderProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="header"
	data-slot="command-palette-header"
	class={cn(styles.header, className)}
>
	{@render children?.()}
</Element>
