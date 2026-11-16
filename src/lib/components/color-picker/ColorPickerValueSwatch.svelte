<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerValueSwatchProps
		extends Omit<HTMLProps<'div'>, 'value'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** Paint the swatch with its alpha, or as an opaque hex colour. */
		respectAlpha?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { setColorPickerSwatchContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		respectAlpha = true,
		...props
	}: ColorPickerValueSwatchProps = $props();

	const api = useColorPickerContext();
	const value = $derived(api.valueAsString);
	const swatch = $derived(api.swatchState(value));
	const swatchStyle = $derived(api.swatchStyle(value, respectAlpha));

	setColorPickerSwatchContext({
		get value() {
			return api.valueAsString;
		},
		get respectAlpha() {
			return respectAlpha;
		}
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="color-picker"
	data-part="swatch"
	data-state={swatch.checked ? 'checked' : 'unchecked'}
	data-value={swatch.valueAsString}
	style={mergeStyleDeclarations(swatchStyle, props.style)}
	data-slot="color-picker-value-swatch"
	class={cn(styles.valueSwatch, className)}
>
	{@render children?.()}
</Element>
