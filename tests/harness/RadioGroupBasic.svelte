<script lang="ts">
	import {
		RadioGroup,
		RadioGroupLabel,
		RadioGroupOption
	} from '../../src/lib/components/radio-group/index.js';

	let {
		defaultValue = undefined,
		disabled = undefined,
		invalid = undefined,
		onValueChange = undefined,
		readOnly = undefined,
		required = undefined
	} = $props();
</script>

<RadioGroup
	{defaultValue}
	{disabled}
	{invalid}
	{onValueChange}
	{readOnly}
	{required}
	name="fruit"
>
	<RadioGroupLabel>Pick a fruit</RadioGroupLabel>
	<RadioGroupOption value="apple">Apple</RadioGroupOption>
	<RadioGroupOption value="banana">Banana</RadioGroupOption>
	<RadioGroupOption value="cherry" disabled>Cherry</RadioGroupOption>
</RadioGroup>
