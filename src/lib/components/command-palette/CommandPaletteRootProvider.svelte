<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		CommandPaletteApi,
		CommandPalettePortalTarget
	} from './command-palette.state.svelte';

	export interface CommandPaletteRootProviderProps {
		value: CommandPaletteApi;
		portalled?: boolean;
		portalRef?: CommandPalettePortalTarget;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setCommandPaletteContext } from './command-palette.state.svelte';
	import { setCommandPaletteOverlayContext } from './command-palette.overlay.svelte';

	let { children, portalled = true, portalRef, value }: CommandPaletteRootProviderProps = $props();

	setCommandPaletteContext(untrack(() => value));
	setCommandPaletteOverlayContext({
		portalled: () => portalled,
		portalRef: () => portalRef
	});
</script>

{@render children?.()}
