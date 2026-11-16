<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorFormat } from './color.js';

	export interface ColorPickerViewProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		/** Only renders while the picker's current format matches. */
		format: ColorFormat;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import { setColorPickerFormatContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		format,
		ref = $bindable(null),
		...props
	}: ColorPickerViewProps = $props();

	const api = useColorPickerContext();

	setColorPickerFormatContext({
		get format() {
			return format;
		}
	});
</script>

{#if api.format === format}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		dir={api.dir}
		data-scope="color-picker"
		data-part="view"
		data-format={format}
		data-slot="color-picker-view"
		class={cn(styles.view, className)}
	>
		{@render children?.()}
	</Element>
{/if}
