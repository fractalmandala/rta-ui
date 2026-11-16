<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteClearTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import closeButtonStyles from '../close-button/CloseButton.module.css';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteComboboxContext } from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		...props
	}: CommandPaletteClearTriggerProps = $props();

	const api = useCommandPaletteComboboxContext();
	const attrs = $derived({
		...api.clearTriggerAttrs(),
		'aria-label': ariaLabel ?? api.translations.clearTriggerLabel
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations('style' in attrs ? attrs.style : undefined, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="clear-trigger"
	data-slot="command-palette-clear-trigger"
	class={cn(closeButtonStyles.root, styles.clearTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else if !asChild}
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
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	{/if}
</Element>
