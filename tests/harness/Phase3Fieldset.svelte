<script lang="ts">
	import { Fieldset } from '../../src/lib/components/fieldset/index';
	import { FieldsetLegend } from '../../src/lib/components/fieldset/index';
	import { FieldsetHelperText } from '../../src/lib/components/fieldset/index';
	import { FieldsetErrorText } from '../../src/lib/components/fieldset/index';
	import { Field } from '../../src/lib/components/field/index';
	import { FieldLabel } from '../../src/lib/components/field/index';
	import { NativeSelect } from '../../src/lib/components/native-select/index';

	let {
		invalid = false,
		disabled = false
	}: { invalid?: boolean; disabled?: boolean } = $props();
</script>

<Fieldset id="set" {invalid} {disabled}>
	<FieldsetLegend>Preferences</FieldsetLegend>
	<Field id="inner">
		<FieldLabel>Size</FieldLabel>
		<NativeSelect>
			<option value="s">Small</option>
			<option value="l">Large</option>
		</NativeSelect>
	</Field>
	<FieldsetHelperText>Choose your preferences</FieldsetHelperText>
	<FieldsetErrorText>Something is wrong</FieldsetErrorText>
</Fieldset>
