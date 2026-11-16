<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerSwatchGroupProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ColorPickerSwatchGroupProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	role="group"
	data-scope="color-picker"
	data-part="swatch-group"
	data-slot="color-picker-swatch-group"
	class={cn(styles.swatchGroup, className)}
>
	{@render children?.()}
</Element>
