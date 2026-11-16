<script lang="ts">
	import {
		DateInput,
		DateInputControl,
		DateInputHiddenInput,
		DateInputLabel,
		DateInputSegments,
		DateInputSeparator,
		type CalendarDate,
		type DateInputValue,
		type DateInputValueChangeDetails
	} from '../../src/lib/components/date-input/index';

	let {
		value = $bindable(undefined as DateInputValue),
		defaultValue = undefined,
		min = undefined,
		max = undefined,
		name = 'appointment',
		locale = 'en-US',
		disabled = false,
		readOnly = false,
		onValueChange = undefined,
		onFocusChange = undefined
	}: {
		value?: DateInputValue;
		defaultValue?: DateInputValue;
		min?: CalendarDate;
		max?: CalendarDate;
		name?: string;
		locale?: string;
		disabled?: boolean;
		readOnly?: boolean;
		onValueChange?: (details: DateInputValueChangeDetails) => void;
		onFocusChange?: (details: { focused: boolean }) => void;
	} = $props();
</script>

<DateInput
	bind:value
	{defaultValue}
	{min}
	{max}
	{name}
	{locale}
	{disabled}
	{readOnly}
	{onValueChange}
	{onFocusChange}
>
	<DateInputLabel>Appointment</DateInputLabel>
	<DateInputControl>
		<DateInputSegments />
		<DateInputHiddenInput />
	</DateInputControl>
</DateInput>

<p data-testid="separator-demo">
	<DateInputSeparator>·</DateInputSeparator>
</p>
