<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerTableHeaderProps
		extends HTMLProps<'th'>,
			PolymorphicProps<'th'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import { useDatePickerContext, useDatePickerViewContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DatePickerTableHeaderProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();
	const attrs = $derived(api.getTableHeaderProps({ view: view() }));
</script>

<Element
	as="th"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-header"
	data-slot="date-picker-table-header"
	class={cn(styles.tableHeader, className)}
>
	{@render children?.()}
</Element>
