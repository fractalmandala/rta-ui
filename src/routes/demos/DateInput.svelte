<script lang="ts">
	import {
		DateInput,
		DateInputControl,
		DateInputHiddenInput,
		DateInputLabel,
		DateInputSegments
	} from '../../lib/components/date-input/index';
	import { CalendarDate } from '../../lib/internal/date';

	let appointment = $state('2024-03-15');
</script>

<DateInput
	bind:value={appointment}
	name="appointment"
	min={new CalendarDate(2024, 1, 1)}
	max={new CalendarDate(2024, 12, 31)}
>
	<DateInputLabel>Appointment</DateInputLabel>
	<DateInputControl>
		<DateInputSegments />
		<DateInputHiddenInput />
	</DateInputControl>
</DateInput>

<p>Appointment: {appointment}</p>

<DateInput name="deadline" defaultValue="2024-06-30">
	<DateInputLabel>Deadline</DateInputLabel>
	<DateInputControl>
		<DateInputSegments />
		<DateInputHiddenInput />
	</DateInputControl>
</DateInput>
