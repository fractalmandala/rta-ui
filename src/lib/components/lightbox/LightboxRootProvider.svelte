<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { DialogApi, DialogPortalTarget } from '../dialog/dialog.state.svelte';
	import type { LightboxApi } from './lightbox.state.svelte';

	export interface LightboxRootProviderProps {
		value: DialogApi;
		lightbox: LightboxApi;
		portalled?: boolean;
		portalRef?: DialogPortalTarget;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import DialogRootProvider from '../dialog/DialogRootProvider.svelte';
	import { setLightboxContext } from './lightbox.state.svelte';

	let { children, lightbox, portalled = true, portalRef, value }: LightboxRootProviderProps =
		$props();

	setLightboxContext(untrack(() => lightbox));
</script>

<DialogRootProvider value={value} {portalled} {portalRef}>
	{@render children?.()}
</DialogRootProvider>
