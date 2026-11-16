<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { PolymorphicProps } from '../../internal/types';
	import type { HTMLProps, RefAttribute } from '../../internal/types';
	import type { ColorPickerApi } from './color-picker.state.svelte';

	export interface ColorPickerRootProviderProps
		extends Omit<HTMLProps<'div'>, 'id' | 'children'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** API created outside the rendered tree with `createColorPicker`. */
		value: ColorPickerApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { setColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ColorPickerRootProviderProps = $props();

	// Captured once: the provider receives an api that outlives this component.
	const api = untrack(() => value);
	setColorPickerContext(api);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={value.rootId}
	dir={value.dir}
	data-scope="color-picker"
	data-part="root"
	data-disabled={dataAttr(value.disabled)}
	data-readonly={dataAttr(value.readOnly)}
	data-invalid={dataAttr(value.invalid)}
	style={mergeStyleDeclarations(value.rootStyle, props.style)}
	data-slot="color-picker-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
