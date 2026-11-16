<script module lang="ts">
	import type { DatePickerTableProps } from './DatePickerTable.svelte';

	export interface DatePickerMonthTableProps
		extends Omit<DatePickerTableProps, 'asChild' | 'children'> {
		format?: 'short' | 'long';
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
	import DatePickerTableRow from './DatePickerTableRow.svelte';
	import DatePickerViewControl from './DatePickerViewControl.svelte';
	import DatePickerViewTrigger from './DatePickerViewTrigger.svelte';
	import { useDatePickerContext } from './date-picker.state.svelte';

	let {
		columns = 4,
		format = 'short',
		showHeader = true,
		...props
	}: DatePickerMonthTableProps = $props();

	const api = useDatePickerContext();
</script>

{#if showHeader}
	<DatePickerViewControl>
		<DatePickerPrevTrigger />
		<DatePickerViewTrigger />
		<DatePickerNextTrigger />
	</DatePickerViewControl>
{/if}
<DatePickerTable {...props} view="month" {columns}>
	<DatePickerTableBody>
		{#each api.getMonthsGrid({ columns, format }) as months (months[0]?.value ?? 0)}
			<DatePickerTableRow>
				{#each months as month (month.value)}
					<DatePickerTableCell value={month.value}>
						<DatePickerTableCellTrigger>{month.label}</DatePickerTableCellTrigger>
					</DatePickerTableCell>
				{/each}
			</DatePickerTableRow>
		{/each}
	</DatePickerTableBody>
</DatePickerTable>
