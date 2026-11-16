<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteDescriptionProps
		extends HTMLProps<'p'>,
			PolymorphicProps<'p'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteContext } from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteDescriptionProps = $props();

	const api = useCommandPaletteContext();
	const attrs = $derived(api.descriptionAttrs());

	$effect(() => {
		api.markRendered('description', true);
		return () => api.markRendered('description', false);
	});
</script>

<Element
	as="p"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="description"
	data-slot="command-palette-description"
	class={cn(styles.description, className)}
>
	{@render children?.()}
</Element>
