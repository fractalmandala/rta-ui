<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';

	export interface ColorPickerSlidersProps extends HTMLProps<'div'>, PolymorphicProps<'div'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import ColorPickerChannelSlider from './ColorPickerChannelSlider.svelte';

	let {
		asChild,
		children,
		class: className,
		...props
	}: ColorPickerSlidersProps = $props();
</script>

<Element
	as="div"
	{...props}
	{asChild}
	data-slot="color-picker-sliders"
	class={cn(styles.sliders, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<ColorPickerChannelSlider channel="hue" />
		<ColorPickerChannelSlider channel="alpha" />
	{/if}
</Element>
