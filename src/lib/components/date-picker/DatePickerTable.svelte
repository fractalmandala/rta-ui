<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';
	import type { DatePickerView as DatePickerViewName } from './date-picker.state.svelte';

	export interface DatePickerTableProps extends HTMLProps<'table'>, PolymorphicProps<'table'> {
		columns?: number;
		id?: string;
		view?: DatePickerViewName;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import {
		setDatePickerViewContext,
		useDatePickerContext,
		useDatePickerViewContext
	} from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		columns,
		id,
		view,
		...props
	}: DatePickerTableProps = $props();

	const api = useDatePickerContext();
	const parentView = useDatePickerViewContext();
	const tableId = $props.id();
	const resolvedView = $derived(view ?? parentView());
	const attrs = $derived(api.getTableProps({ view: resolvedView, columns, id: id ?? tableId }));

	setDatePickerViewContext(() => resolvedView);
</script>

<Element
	as="table"
	{...props}
	{...attrs}
	{asChild}
	data-scope="date-picker"
	data-part="table"
	data-slot="date-picker-table"
	class={cn(styles.table, className)}
>
	{@render children?.()}
</Element>
