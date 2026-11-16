<script module lang="ts">
	import type { DatePickerTableProps } from './DatePickerTable.svelte';

	export interface DatePickerDayTableProps
		extends Omit<DatePickerTableProps, 'asChild' | 'children' | 'columns'> {
		offset?: number;
		showHeader?: boolean;
	}
</script>

<script lang="ts">
	import DatePickerNextTrigger from './DatePickerNextTrigger.svelte';
	import DatePickerPrevTrigger from './DatePickerPrevTrigger.svelte';
	import DatePickerTable from './DatePickerTable.svelte';
	import DatePickerTableBody from './DatePickerTableBody.svelte';
	import DatePickerTableCell from './DatePickerTableCell.svelte';
	import DatePickerTableCellTrigger from './DatePickerTableCellTrigger.svelte';
	import DatePickerTableHead from './DatePickerTableHead.svelte';
	import DatePickerTableHeader from './DatePickerTableHeader.svelte';
	import DatePickerTableRow from './DatePickerTableRow.svelte';
	import DatePickerViewControl from './DatePickerViewControl.svelte';
	import DatePickerViewTrigger from './DatePickerViewTrigger.svelte';
	import DatePickerWeekNumberCell from './DatePickerWeekNumberCell.svelte';
	import DatePickerWeekNumberHeaderCell from './DatePickerWeekNumberHeaderCell.svelte';
	import { useDatePickerContext } from './date-picker.state.svelte';

	let { offset, showHeader = true, ...props }: DatePickerDayTableProps = $props();

	const api = useDatePickerContext();
	const offsetMonth = $derived(offset ? api.getOffset({ months: offset }) : undefined);
	const weeks = $derived(offsetMonth?.weeks ?? api.weeks);
</script>

{#if showHeader}
	<DatePickerViewControl>
		<DatePickerPrevTrigger />
		<DatePickerViewTrigger />
		<DatePickerNextTrigger />
	</DatePickerViewControl>
{/if}
<DatePickerTable {...props} view="day">
	<DatePickerTableHead>
		<DatePickerTableRow>
			{#if api.showWeekNumbers}
				<DatePickerWeekNumberHeaderCell />
			{/if}
			{#each api.weekDays as weekDay (weekDay.value.toString())}
				<DatePickerTableHeader>
					{weekDay.short}
				</DatePickerTableHeader>
			{/each}
		</DatePickerTableRow>
	</DatePickerTableHead>
	<DatePickerTableBody>
		{#each weeks as week, weekIndex (week[0]?.toString() ?? weekIndex)}
			<DatePickerTableRow>
				{#if api.showWeekNumbers}
					<DatePickerWeekNumberCell {week} {weekIndex}>
						{api.getWeekNumber(week)}
					</DatePickerWeekNumberCell>
				{/if}
				{#each week as day (day.toString())}
					<DatePickerTableCell value={day} visibleRange={offsetMonth?.visibleRange}>
						<DatePickerTableCellTrigger>{day.day}</DatePickerTableCellTrigger>
					</DatePickerTableCell>
				{/each}
			</DatePickerTableRow>
		{/each}
	</DatePickerTableBody>
</DatePickerTable>
