<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorType } from './color.js';

	export interface ColorPickerSwatchTriggerProps
		extends Omit<HTMLProps<'button'>, 'type' | 'value'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		value: string | ColorType;
		/** Disables this swatch only, keeping the rest of the picker interactive. */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import ColorPickerSwatch from './ColorPickerSwatch.svelte';
	import ColorPickerSwatchIndicator from './ColorPickerSwatchIndicator.svelte';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		onclick,
		ref = $bindable(null),
		value,
		...props
	}: ColorPickerSwatchTriggerProps = $props();

	const api = useColorPickerContext();
	const swatch = $derived(api.swatchState(value, disabled));
	const triggerStyle = $derived(api.swatchTriggerStyle(value, disabled));
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	dir={api.dir}
	disabled={swatch.disabled}
	aria-label="select {swatch.valueAsString} as the color"
	data-scope="color-picker"
	data-part="swatch-trigger"
	data-state={swatch.checked ? 'checked' : 'unchecked'}
	data-value={swatch.valueAsString}
	data-disabled={dataAttr(swatch.disabled)}
	style={mergeStyleDeclarations(triggerStyle, props.style)}
	data-slot="color-picker-swatch-trigger"
	class={cn(styles.swatchTrigger, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.onSwatchTriggerClick(value, disabled);
	}}
>
	{#if children}
		{@render children()}
	{:else}
		<ColorPickerSwatch {value}>
			<ColorPickerSwatchIndicator />
		</ColorPickerSwatch>
	{/if}
</Element>
