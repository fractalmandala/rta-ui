<script lang="ts">
	import {
		PinInput,
		PinInputControl,
		PinInputHiddenInput,
		PinInputInputs,
		PinInputLabel
	} from '../../lib/components/pin-input/index';

	let value = $state(['', '', '', '']);
	let complete = $state(false);
</script>

<PinInput count={4} bind:value onValueComplete={() => (complete = true)}>
	<PinInputLabel>Verification code</PinInputLabel>
	<PinInputControl>
		<PinInputInputs />
	</PinInputControl>
	<PinInputHiddenInput name="code" />
</PinInput>

<p>Value: {value.join('') || 'empty'}</p>
<p>Status: {complete ? 'complete' : 'incomplete'}</p>
<button type="button" onclick={() => (value = ['', '', '', ''])}>Clear</button>
