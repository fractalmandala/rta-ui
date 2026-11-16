<script lang="ts">
	import { Field, FieldErrorText, FieldHelperText, FieldLabel } from '../../src/lib/components/field/index';
	import {
		SignaturePad,
		SignaturePadClearTrigger,
		SignaturePadControl,
		SignaturePadGuide,
		SignaturePadSegment
	} from '../../src/lib/components/signature-pad/index';

	let {
		disabled = false,
		invalid = false,
		readOnly = false
	}: { disabled?: boolean; invalid?: boolean; readOnly?: boolean } = $props();
</script>

<Field {disabled} {invalid} {readOnly}>
	<FieldLabel>Signature</FieldLabel>
	<SignaturePad>
		<SignaturePadControl>
			<SignaturePadSegment />
			<SignaturePadClearTrigger />
			<SignaturePadGuide />
		</SignaturePadControl>
	</SignaturePad>
	<FieldHelperText>Sign above the line</FieldHelperText>
	<FieldErrorText>Signature is required</FieldErrorText>
</Field>
