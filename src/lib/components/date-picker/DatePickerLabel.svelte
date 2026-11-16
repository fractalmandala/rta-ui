<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerLabelProps
		extends HTMLProps<'label'>,
			PolymorphicProps<'label'>,
			RefAttribute {
		index?: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { useDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index = 0,
		ref = $bindable(null),
		...props
	}: DatePickerLabelProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getLabelProps({ index }));
</script>

<Element
	as="label"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="label"
	data-slot="date-picker-label"
	class={cn(styles.label, className)}
>
	{@render children?.()}
</Element>
