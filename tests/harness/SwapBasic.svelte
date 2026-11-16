<script lang="ts">
	import { Swap, SwapIndicator } from '../../src/lib/components/swap/index.js';

	let { swap = undefined } = $props();
</script>

<Swap {swap}>
	<SwapIndicator type="on">on</SwapIndicator>
	<SwapIndicator type="off">off</SwapIndicator>
</Swap>
