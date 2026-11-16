<script lang="ts">
	import {
		NumberInput,
		NumberInputControl,
		NumberInputDecrementTrigger,
		NumberInputIncrementTrigger,
		NumberInputInput,
		NumberInputLabel,
		NumberInputScrubber
	} from '../../lib/components/number-input/index';

	let quantity = $state('1');
	let price = $state('19.99');
</script>

<NumberInput bind:value={quantity} min={0} max={20} step={1}>
	<NumberInputLabel>Quantity</NumberInputLabel>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInput>

<p>Ordering {quantity} item{quantity === '1' ? '' : 's'}</p>

<NumberInput
	bind:value={price}
	min={0}
	max={1000}
	step={0.5}
	locale="en-US"
	formatOptions={{ style: 'currency', currency: 'USD' }}
>
	<NumberInputLabel>Unit price</NumberInputLabel>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInput>

<p>Unit price: {price}</p>

<NumberInput defaultValue="50" min={0} max={100} step={1} size="lg">
	<NumberInputLabel>Drag to scrub</NumberInputLabel>
	<NumberInputScrubber>Scrub</NumberInputScrubber>
	<NumberInputControl>
		<NumberInputDecrementTrigger />
		<NumberInputInput />
		<NumberInputIncrementTrigger />
	</NumberInputControl>
</NumberInput>
