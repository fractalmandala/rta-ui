<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorStringFormat } from './color.js';

	export interface ColorPickerValueTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		/** Overrides the string format of the rendered value. */
		format?: ColorStringFormat;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		format,
		ref = $bindable(null),
		...props
	}: ColorPickerValueTextProps = $props();

	const api = useColorPickerContext();
	const text = $derived(api.formatValue(format));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="color-picker"
	data-part="value-text"
	data-disabled={dataAttr(api.disabled)}
	data-focus={dataAttr(api.focused)}
	data-slot="color-picker-value-text"
	class={cn(styles.valueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</Element>
