<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { DialogApi, DialogPortalTarget } from './dialog.state.svelte';

	export interface DialogRootProviderProps {
		value: DialogApi;
		portalled?: boolean;
		portalRef?: DialogPortalTarget;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setDialogContext } from './dialog.state.svelte';
	import { setDialogOverlayContext } from './dialog.overlay.svelte';

	let { children, portalled = true, portalRef, value }: DialogRootProviderProps = $props();

	setDialogContext(untrack(() => value));
	setDialogOverlayContext({
		portalled: () => portalled,
		portalRef: () => portalRef
	});
</script>

{@render children?.()}
