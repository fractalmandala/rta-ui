<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { FloatingPanelApi } from './floating-panel.state.svelte';

	export interface FloatingPanelRootProviderProps {
		value: FloatingPanelApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setFloatingPanelContext } from './floating-panel.state.svelte';

	let { children, value }: FloatingPanelRootProviderProps = $props();

	setFloatingPanelContext(untrack(() => value));
</script>

{@render children?.()}
