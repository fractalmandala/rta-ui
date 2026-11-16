<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
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
		ref = $bindable(null),
		...props
	}: ColorPickerControlProps = $props();

	const api = useColorPickerContext();

	$effect(() => {
		api.setControlNode(ref as HTMLElement | null);
		return () => api.setControlNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.controlId}
	dir={api.dir}
	data-scope="color-picker"
	data-part="control"
	data-disabled={dataAttr(api.disabled)}
	data-readonly={dataAttr(api.readOnly)}
	data-invalid={dataAttr(api.invalid)}
	data-state={api.open ? 'open' : 'closed'}
	data-focus={dataAttr(api.focused)}
	data-slot="color-picker-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
