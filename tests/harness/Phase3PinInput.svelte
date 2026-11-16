<script lang="ts">
	import {
		PinInput,
		PinInputControl,
		PinInputHiddenInput,
		PinInputInputs,
		PinInputLabel
	} from '../../src/lib/components/pin-input/index';
	import type {
		PinInputValueChangeDetails,
		PinInputValueCompleteDetails
	} from '../../src/lib/components/pin-input/index';

	let {
		count = 4,
		mask = false,
		otp = false,
		disabled = false,
		invalid = false,
		name = 'code',
		value = $bindable(['', '', '', '']),
		onValueChange,
		onValueComplete
	}: {
		count?: number;
		mask?: boolean;
		otp?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		name?: string;
		value?: string[];
		onValueChange?: (details: PinInputValueChangeDetails) => void;
		onValueComplete?: (details: PinInputValueCompleteDetails) => void;
	} = $props();
</script>

<PinInput {count} {mask} {otp} {disabled} {invalid} {name} bind:value {onValueChange} {onValueComplete}>
	<PinInputLabel>Verification code</PinInputLabel>
	<PinInputControl>
		<PinInputInputs />
	</PinInputControl>
	<PinInputHiddenInput />
</PinInput>
