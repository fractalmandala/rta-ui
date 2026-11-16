<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteContext } from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteContentProps = $props();

	const api = useCommandPaletteContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		api.registerContent(ref);
		return () => api.registerContent(null);
	});
</script>

{#if !api.unmounted}
	<Element
		as="div"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-scope="command-palette"
		data-part="content"
		data-slot="command-palette-content"
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/if}
