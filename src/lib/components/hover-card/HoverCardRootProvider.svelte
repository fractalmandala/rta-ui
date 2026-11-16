<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HoverCardApi } from './hover-card.state.svelte';

	export interface HoverCardRootProviderProps {
		value: HoverCardApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setHoverCardContext } from './hover-card.state.svelte';

	let { children, value }: HoverCardRootProviderProps = $props();

	setHoverCardContext(untrack(() => value));
</script>

{@render children?.()}
