<script lang="ts">
	import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '../../lib/index';

	let value = $state('card');
</script>

<RadioGroup bind:value name="payment">
	<RadioGroupLabel>Payment method</RadioGroupLabel>
	<RadioGroupOption value="card">Card</RadioGroupOption>
	<RadioGroupOption value="cash">Cash</RadioGroupOption>
	<RadioGroupOption value="crypto" disabled>Crypto</RadioGroupOption>
</RadioGroup>
