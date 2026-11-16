<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CalendarDate } from '../../internal/date';

	export interface DatePickerTableCellTriggerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DatePicker.module.css';
	import {
		useDatePickerCellContext,
		useDatePickerContext,
		useDatePickerViewContext
	} from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DatePickerTableCellTriggerProps = $props();

	const api = useDatePickerContext();
	const view = useDatePickerViewContext();
	const cell = useDatePickerCellContext();

	const attrs = $derived.by(() => {
		const current = cell();
		if (view() === 'day') {
			return api.getDayTableCellTriggerProps({
				value: current.value as CalendarDate,
				disabled: current.disabled,
				columns: current.columns,
				visibleRange: current.visibleRange
			});
		}
		if (view() === 'month') {
			return api.getMonthTableCellTriggerProps({
				value: current.value as number,
				disabled: current.disabled,
				columns: current.columns
			});
		}
		return api.getYearTableCellTriggerProps({
			value: current.value as number,
			disabled: current.disabled,
			columns: current.columns
		});
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="date-picker"
	data-part="table-cell-trigger"
	data-slot="date-picker-table-cell-trigger"
	class={cn(styles.tableCellTrigger, className)}
>
	{@render children?.()}
</Element>
