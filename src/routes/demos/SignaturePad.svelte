<script lang="ts">
	import { Field, FieldHelperText, FieldLabel } from '../../lib/components/field/index';
	import { SignaturePad, SignaturePadCanvas, SignaturePadHiddenInput } from '../../lib/components/signature-pad/index';

	let paths = $state<string[]>([]);
	let readOnly = $state(false);
</script>

<Field {readOnly}>
	<FieldLabel>Signature</FieldLabel>
	<SignaturePad bind:paths name="signature">
		<SignaturePadCanvas />
		<SignaturePadHiddenInput value={paths.join(' ')} />
	</SignaturePad>
	<FieldHelperText>Draw with a mouse, pen or finger. Clear with the arrow button.</FieldHelperText>
</Field>

<button type="button" onclick={() => (readOnly = !readOnly)}>
	{readOnly ? 'Enable' : 'Disable'} drawing
</button>
<button type="button" onclick={() => (paths = [])}>Reset</button>
