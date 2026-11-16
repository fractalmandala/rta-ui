<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteTitleProps
		extends HTMLProps<'h2'>,
			PolymorphicProps<'h2'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteContext } from './command-palette.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: CommandPaletteTitleProps =
		$props();

	const api = useCommandPaletteContext();
	const attrs = $derived(api.titleAttrs());

	$effect(() => {
		api.markRendered('title', true);
		return () => api.markRendered('title', false);
	});
</script>

<Element
	as="h2"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="title"
	data-slot="command-palette-title"
	class={cn(styles.title, className)}
>
	{@render children?.()}
</Element>
