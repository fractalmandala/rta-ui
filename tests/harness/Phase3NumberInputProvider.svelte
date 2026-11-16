<script lang="ts">
	import {
		NumberInputRootProvider,
		NumberInputControl,
		NumberInputDecrementTrigger,
		NumberInputIncrementTrigger,
		NumberInputInput,
		NumberInputLabel,
		createNumberInput,
		type NumberInputSize
	} from '../../src/lib/components/number-input/index';

	let {
		initial = '3',
		size = 'sm'
	}: {
		initial?: string;
		size?: NumberInputSize;
	} = $props();

	const uid = $props.id();
	const api = createNumberInput(() => ({ defaultValue: initial, min: 0, max: 10 }), uid);
</script>

<NumberInputRootProvider value={api} {size}>
	<NumberInputLabel>Amount</NumberInputLabel>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInputRootProvider>
