<script lang="ts">
	import {
		Field,
		FieldLabel,
		FieldHelperText,
		FieldRequiredIndicator
	} from '../../lib/components/field/index';
	import { NativeSelect } from '../../lib/components/native-select/index';
	import { Fieldset, FieldsetLegend, FieldsetHelperText } from '../../lib/components/fieldset/index';
	import { Input } from '../../lib/components/input/index';
</script>

<Fieldset>
	<FieldsetLegend>Shipping address</FieldsetLegend>
	<FieldsetHelperText>Where the order should arrive.</FieldsetHelperText>

	<Field id="address-line">
		<FieldLabel>Street</FieldLabel>
		<Input placeholder="12 Orchard Lane" />
	</Field>

	<Field id="address-country" required>
		<FieldLabel>
			Country
			<FieldRequiredIndicator />
		</FieldLabel>
		<NativeSelect value="nz">
			<option value="au">Australia</option>
			<option value="nz">New Zealand</option>
			<option value="jp">Japan</option>
		</NativeSelect>
		<FieldHelperText>We ship within these regions only.</FieldHelperText>
	</Field>
</Fieldset>
