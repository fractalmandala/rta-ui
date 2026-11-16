<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerAreaBackgroundProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerAreaContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ColorPickerAreaBackgroundProps = $props();

	const api = useColorPickerContext();
	const area = useColorPickerAreaContext();
	const backgroundStyle = $derived(api.areaBackgroundStyle(area));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.areaGradientId}
	data-scope="color-picker"
	data-part="area-background"
	data-invalid={dataAttr(api.invalid)}
	data-disabled={dataAttr(api.disabled)}
	data-readonly={dataAttr(api.readOnly)}
	style={mergeStyleDeclarations(backgroundStyle, props.style)}
	data-slot="color-picker-area-background"
	class={cn(styles.areaBackground, className)}
>
	{@render children?.()}
</Element>
