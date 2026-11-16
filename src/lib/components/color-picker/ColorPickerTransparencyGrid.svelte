<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerTransparencyGridProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		/** Size of one checkerboard cell. */
		size?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size,
		...props
	}: ColorPickerTransparencyGridProps = $props();

	const api = useColorPickerContext();
	const gridStyle = $derived(api.transparencyGridStyle(size));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="color-picker"
	data-part="transparency-grid"
	style={mergeStyleDeclarations(gridStyle, props.style)}
	data-slot="color-picker-transparency-grid"
	class={cn(styles.transparencyGrid, className)}
>
	{@render children?.()}
</Element>
