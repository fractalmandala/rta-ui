<script lang="ts">
	import { Field } from '../../src/lib/components/field/index';
	import { FieldLabel } from '../../src/lib/components/field/index';
	import { FieldHelperText } from '../../src/lib/components/field/index';
	import { FieldErrorText } from '../../src/lib/components/field/index';
	import { FieldRequiredIndicator } from '../../src/lib/components/field/index';
	import { NativeSelect } from '../../src/lib/components/native-select/index';

	let {
		invalid = false,
		required = false,
		disabled = false,
		readOnly = false,
		value = $bindable('a'),
		onValueChange
	}: {
		invalid?: boolean;
		required?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		value?: string;
		onValueChange?: (next: string) => void;
	} = $props();
</script>

<Field id="demo" {invalid} {required} {disabled} {readOnly}>
	<FieldLabel>
		Fruit
		<FieldRequiredIndicator />
	</FieldLabel>
	<NativeSelect bind:value onchange={() => onValueChange?.(value)}>
		<option value="a">Apple</option>
		<option value="b">Banana</option>
		<option value="c">Cherry</option>
	</NativeSelect>
	<FieldHelperText>Pick one</FieldHelperText>
	<FieldErrorText>Required</FieldErrorText>
</Field>
