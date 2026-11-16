<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CalendarDate } from '../../internal/date';

	export interface DatePickerTableCellProps
		extends HTMLProps<'td'>,
			PolymorphicProps<'td'>,
			RefAttribute {
		value: CalendarDate | number;
		disabled?: boolean;
		columns?: number;
		visibleRange?: { start: CalendarDate; end: CalendarDate };
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import {
		setDatePickerCellContext,
		useDatePickerContext,
		useDatePickerViewContext
	} from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		columns,
		disabled,
		ref = $bindable(null),
		value,
		visibleRange,
		...props
	}: DatePickerTableCellProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();

	const attrs = $derived.by(() => {
		if (view() === 'day') {
			return api.getDayTableCellProps({
				value: value as CalendarDate,
				disabled,
				columns,
				visibleRange
			});
		}
		if (view() === 'month') return api.getMonthTableCellProps({ value: value as number, disabled, columns });
		return api.getYearTableCellProps({ value: value as number, disabled, columns });
	});

	setDatePickerCellContext(() => ({ value, disabled, columns, visibleRange }));
</script>

<Element
	as="td"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-cell"
	data-slot="date-picker-table-cell"
	class={cn(styles.tableCell, className)}
>
	{@render children?.()}
</Element>
