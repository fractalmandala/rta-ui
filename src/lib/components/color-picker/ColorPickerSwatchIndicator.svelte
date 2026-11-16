<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerSwatchIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext, useColorPickerSwatchContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ColorPickerSwatchIndicatorProps = $props();

	const api = useColorPickerContext();
	const swatch = useColorPickerSwatchContext();
	const state = $derived(api.swatchState(swatch?.value ?? api.value));
	const checked = $derived(state.checked);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	hidden={!checked}
	data-scope="color-picker"
	data-part="swatch-indicator"
	data-slot="color-picker-swatch-indicator"
	class={cn(styles.swatchIndicator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	{/if}
</Element>
