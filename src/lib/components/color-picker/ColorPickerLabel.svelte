<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
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
		onclick,
		ref = $bindable(null),
		...props
	}: ColorPickerLabelProps = $props();

	const api = useColorPickerContext();
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	id={api.labelId}
	dir={api.dir}
	for={api.hiddenInputId}
	data-scope="color-picker"
	data-part="label"
	data-disabled={dataAttr(api.disabled)}
	data-readonly={dataAttr(api.readOnly)}
	data-invalid={dataAttr(api.invalid)}
	data-required={dataAttr(api.required)}
	data-focus={dataAttr(api.focused)}
	data-slot="color-picker-label"
	class={cn(styles.label, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.onLabelClick(event);
	}}
>
	{@render children?.()}
</Element>
