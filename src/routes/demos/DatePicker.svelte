<script lang="ts">
	import {
		DatePicker,
		DatePickerClearTrigger,
		DatePickerContent,
		DatePickerControl,
		DatePickerDayTable,
		DatePickerInput,
		DatePickerLabel,
		DatePickerMonthTable,
		DatePickerPositioner,
		DatePickerPresetTrigger,
		DatePickerRangeText,
		DatePickerTrigger,
		DatePickerValueText,
		DatePickerView,
		DatePickerYearTable
	} from '../../lib/components/date-picker/index';
	import type { CalendarDate } from '../../lib/internal/date';

	let date = $state<CalendarDate[] | undefined>(undefined);
	let range = $state<CalendarDate[] | undefined>(undefined);
</script>

<DatePicker bind:value={date}>
	<DatePickerLabel>Departure</DatePickerLabel>
	<DatePickerControl>
		<DatePickerInput placeholder="mm/dd/yyyy" />
		<DatePickerClearTrigger />
		<DatePickerTrigger />
	</DatePickerControl>
	<DatePickerValueText placeholder="No date chosen" />
	<DatePickerPositioner>
		<DatePickerContent>
			<DatePickerView view="day">
				<DatePickerRangeText />
				<DatePickerDayTable />
			</DatePickerView>
			<DatePickerView view="month">
				<DatePickerMonthTable />
			</DatePickerView>
			<DatePickerView view="year">
				<DatePickerYearTable />
			</DatePickerView>
		</DatePickerContent>
	</DatePickerPositioner>
</DatePicker>

<p>Departure: {date?.[0]?.toString() ?? 'none'}</p>

<DatePicker bind:value={range} selectionMode="range">
	<DatePickerLabel>Trip</DatePickerLabel>
	<DatePickerControl>
		<DatePickerInput index={0} placeholder="mm/dd/yyyy" />
		<DatePickerInput index={1} placeholder="mm/dd/yyyy" />
		<DatePickerClearTrigger />
		<DatePickerTrigger />
	</DatePickerControl>
	<DatePickerPositioner>
		<DatePickerContent>
			<DatePickerView view="day">
				<DatePickerRangeText />
				<DatePickerDayTable />
			</DatePickerView>
			<DatePickerPresetTrigger value="last7Days">Last 7 days</DatePickerPresetTrigger>
			<DatePickerPresetTrigger value="thisMonth">This month</DatePickerPresetTrigger>
		</DatePickerContent>
	</DatePickerPositioner>
</DatePicker>

<p>Trip: {range?.map((item) => item.toString()).join(' to ') ?? 'none'}</p>
