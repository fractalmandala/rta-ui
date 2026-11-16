<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { PopoverApi } from './popover.state.svelte';

	export interface PopoverRootProviderProps {
		value: PopoverApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setPopoverContext } from './popover.state.svelte';

	let { children, value }: PopoverRootProviderProps = $props();

	setPopoverContext(untrack(() => value));
</script>

{@render children?.()}
