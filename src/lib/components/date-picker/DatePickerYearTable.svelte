<script module lang="ts">
	import type { DatePickerTableProps } from './DatePickerTable.svelte';

	export interface DatePickerYearTableProps
		extends Omit<DatePickerTableProps, 'asChild' | 'children'> {
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

	let { columns = 4, showHeader = true, ...props }: DatePickerYearTableProps = $props();

	const api = useDatePickerContext();
</script>

{#if showHeader}
	<DatePickerViewControl>
		<DatePickerPrevTrigger />
		<DatePickerViewTrigger />
		<DatePickerNextTrigger />
	</DatePickerViewControl>
{/if}
<DatePickerTable {...props} view="year" {columns}>
	<DatePickerTableBody>
		{#each api.getYearsGrid({ columns }) as years (years[0]?.value ?? 0)}
			<DatePickerTableRow>
				{#each years as year (year.value)}
					<DatePickerTableCell value={year.value} disabled={year.disabled}>
						<DatePickerTableCellTrigger>{year.label}</DatePickerTableCellTrigger>
					</DatePickerTableCell>
				{/each}
			</DatePickerTableRow>
		{/each}
	</DatePickerTableBody>
</DatePickerTable>
