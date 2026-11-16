<script lang="ts">
	import {
		DatePicker,
		DatePickerClearTrigger,
		DatePickerContent,
		DatePickerControl,
		DatePickerDayTable,
		DatePickerInput,
		DatePickerLabel,
		DatePickerMonthSelect,
		DatePickerMonthTable,
		DatePickerPositioner,
		DatePickerPresetTrigger,
		DatePickerRangeText,
		DatePickerTrigger,
		DatePickerValueText,
		DatePickerView,
		DatePickerYearSelect,
		DatePickerYearTable,
		type CalendarDate,
		type DatePickerOpenChangeDetails,
		type DatePickerValueChangeDetails,
		type DateRangePreset
	} from '../../src/lib/components/date-picker/index';

	const presets: DateRangePreset[] = ['last7Days', 'thisMonth'];

	let {
		mode = 'single',
		value = $bindable(undefined as CalendarDate[] | undefined),
		open = $bindable(undefined as boolean | undefined),
		defaultOpen = undefined,
		defaultValue = undefined,
		referenceDate = undefined,
		onValueChange = undefined,
		onOpenChange = undefined,
		onViewChange = undefined,
		min = undefined,
		max = undefined,
		fixedWeeks = false,
		showWeekNumbers = false,
		startOfWeek = undefined,
		isDateUnavailable = undefined,
		numOfMonths = undefined,
		name = undefined,
		portalled = true,
		withPresets = true,
		withValueText = false
	}: {
		mode?: 'single' | 'range' | 'multiple' | 'views';
		value?: CalendarDate[] | undefined;
		referenceDate?: CalendarDate;
		open?: boolean | undefined;
		defaultOpen?: boolean;
		defaultValue?: CalendarDate[];
		onValueChange?: (details: DatePickerValueChangeDetails) => void;
		onOpenChange?: (details: DatePickerOpenChangeDetails) => void;
		onViewChange?: (details: { view: 'day' | 'month' | 'year' }) => void;
		min?: CalendarDate;
		max?: CalendarDate;
		fixedWeeks?: boolean;
		showWeekNumbers?: boolean;
		startOfWeek?: number;
		isDateUnavailable?: (date: CalendarDate, locale?: string) => boolean;
		numOfMonths?: number;
		name?: string;
		portalled?: boolean;
		withPresets?: boolean;
		withValueText?: boolean;
	} = $props();
</script>

<DatePicker
	bind:value
	bind:open
	{defaultOpen}
	{defaultValue}
	defaultFocusedValue={referenceDate}
	{min}
	{max}
	{fixedWeeks}
	{showWeekNumbers}
	{startOfWeek}
	{isDateUnavailable}
	{numOfMonths}
	{name}
	{portalled}
	selectionMode={mode === 'range' ? 'range' : mode === 'multiple' ? 'multiple' : 'single'}
	{onValueChange}
	{onOpenChange}
	{onViewChange}
>
	<DatePickerLabel>Departure</DatePickerLabel>
	<DatePickerControl>
		{#if mode === 'range'}
			<DatePickerInput index={0} placeholder="mm/dd/yyyy" />
			<DatePickerInput index={1} placeholder="mm/dd/yyyy" />
		{:else}
			<DatePickerInput placeholder="mm/dd/yyyy" />
		{/if}
		<DatePickerClearTrigger />
		<DatePickerTrigger />
	</DatePickerControl>
	{#if withValueText}
		<DatePickerValueText placeholder="Pick a date" />
	{/if}
	<DatePickerPositioner>
		<DatePickerContent>
			<DatePickerView view="day">
				<span class="view-control">
					<DatePickerMonthSelect />
					<DatePickerYearSelect />
				</span>
				<DatePickerRangeText />
				<DatePickerDayTable />
			</DatePickerView>
			<DatePickerView view="month">
				<DatePickerMonthTable />
			</DatePickerView>
			<DatePickerView view="year">
				<DatePickerYearTable />
			</DatePickerView>
			{#if withPresets && mode === 'range'}
				{#each presets as preset (preset)}
					<DatePickerPresetTrigger value={preset}>{preset}</DatePickerPresetTrigger>
				{/each}
			{/if}
		</DatePickerContent>
	</DatePickerPositioner>
</DatePicker>

<button type="button">Outside</button>
