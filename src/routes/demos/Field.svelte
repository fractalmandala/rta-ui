<script lang="ts">
	import {
		Field,
		FieldLabel,
		FieldHelperText,
		FieldErrorText,
		FieldRequiredIndicator
	} from '../../lib/components/field/index';
	import { NativeSelect } from '../../lib/components/native-select/index';

	let value = $state('apple');
	let invalid = $state(false);
</script>

<Field id="fruit" required {invalid}>
	<FieldLabel>
		Favourite fruit
		<FieldRequiredIndicator />
	</FieldLabel>
	<NativeSelect bind:value>
		<option value="apple">Apple</option>
		<option value="banana">Banana</option>
		<option value="cherry">Cherry</option>
	</NativeSelect>
	<FieldHelperText>Choose the fruit you like most.</FieldHelperText>
	<FieldErrorText>Please choose a fruit.</FieldErrorText>
</Field>

<button type="button" onclick={() => (invalid = !invalid)}>Toggle invalid</button>
