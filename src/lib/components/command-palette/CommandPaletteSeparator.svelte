<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteSeparatorProps
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
	}: CommandPaletteSeparatorProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	role="separator"
	data-scope="command-palette"
	data-part="separator"
	data-slot="command-palette-separator"
	class={cn(styles.separator, className)}
>
	{@render children?.()}
</Element>
