<script module lang="ts">
	import type { NumberInputControlProps } from './NumberInputControl.svelte';

	export interface NumberInputFieldProps
		extends Omit<NumberInputControlProps, 'asChild' | 'children'> {}
</script>

<script lang="ts">
	import NumberInputControl from './NumberInputControl.svelte';
	import NumberInputDecrementTrigger from './NumberInputDecrementTrigger.svelte';
	import NumberInputIncrementTrigger from './NumberInputIncrementTrigger.svelte';
	import NumberInputInput from './NumberInputInput.svelte';

	let { ref = $bindable(null), ...props }: NumberInputFieldProps = $props();
</script>

<NumberInputControl {...props} bind:ref>
	<NumberInputDecrementTrigger />
	<NumberInputInput />
	<NumberInputIncrementTrigger />
</NumberInputControl>
