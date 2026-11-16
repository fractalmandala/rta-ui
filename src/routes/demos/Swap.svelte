<script lang="ts">
	import { Swap, SwapIndicator } from '../../lib/index';

	let swap = $state(false);
</script>

<Swap bind:swap animation="fade">
	<SwapIndicator type="on">Close</SwapIndicator>
	<SwapIndicator type="off">Open</SwapIndicator>
</Swap>
<button type="button" onclick={() => (swap = !swap)}>Toggle</button>
