<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteItemIndicatorProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import {
		useCommandPaletteComboboxContext,
		useCommandPaletteItemContext
	} from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteItemIndicatorProps = $props();

	const api = useCommandPaletteComboboxContext();
	const getItem = useCommandPaletteItemContext();
	const attrs = $derived(api.itemIndicatorAttrs(getItem()));
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="item-indicator"
	data-slot="command-palette-item-indicator"
	class={cn(styles.itemIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	{/if}
</Element>
