<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerFormatTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: ColorPickerFormatTriggerProps = $props();

	const api = useColorPickerContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	dir={api.dir}
	aria-label="change color format to {api.nextFormat}"
	data-scope="color-picker"
	data-part="format-trigger"
	data-slot="color-picker-format-trigger"
	class={cn(styles.formatTrigger, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		if (event.currentTarget.disabled) return;
		api.toggleFormat();
	}}
>
	{@render children?.()}
</Element>
