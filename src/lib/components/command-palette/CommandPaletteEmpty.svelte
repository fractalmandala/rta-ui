<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteEmptyProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteComboboxContext } from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteEmptyProps = $props();

	const api = useCommandPaletteComboboxContext();
	const attrs = $derived(api.emptyAttrs());
</script>

{#if api.empty}
	<Element
		as="div"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-scope="command-palette"
		data-part="empty"
		data-slot="command-palette-empty"
		class={cn(styles.empty, className)}
	>
		{#if children}
			{@render children()}
		{:else}
			{api.translations.noResults}
		{/if}
	</Element>
{/if}
