<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { TooltipApi } from './tooltip.state.svelte';

	export interface TooltipRootProviderProps {
		value: TooltipApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setTooltipContext } from './tooltip.state.svelte';

	let { children, value }: TooltipRootProviderProps = $props();

	setTooltipContext(untrack(() => value));
</script>

{@render children?.()}
