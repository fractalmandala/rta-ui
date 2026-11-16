<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { DrawerApi, DrawerPortalTarget } from './drawer.state.svelte';

	export interface DrawerRootProviderProps {
		value: DrawerApi;
		portalled?: boolean;
		portalRef?: DrawerPortalTarget;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setDrawerContext } from './drawer.state.svelte';
	import { setDrawerOverlayContext } from './drawer.overlay.svelte';

	let { children, portalled = true, portalRef, value }: DrawerRootProviderProps = $props();

	setDrawerContext(untrack(() => value));
	setDrawerOverlayContext({ portalled: () => portalled, portalRef: () => portalRef });
</script>

{@render children?.()}
