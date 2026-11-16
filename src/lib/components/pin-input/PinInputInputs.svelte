<script module lang="ts">
	import type { ClassValue } from 'svelte/elements';

	export interface PinInputInputsProps {
		class?: ClassValue;
	}
</script>

<script lang="ts">
	import PinInputInput from './PinInputInput.svelte';
	import { usePinInputContext } from './pin-input.state.svelte';

	let { class: className }: PinInputInputsProps = $props();
	const api = usePinInputContext();
</script>

{#each api.items as index (index)}
	<PinInputInput class={className} {index} />
{/each}
