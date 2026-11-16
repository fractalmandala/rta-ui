<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UseCommandPaletteProps } from './command-palette.state.svelte';

	export interface CommandPaletteRootProps extends UseCommandPaletteProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createCommandPalette, setCommandPaletteContext } from './command-palette.state.svelte';
	import { setCommandPaletteOverlayContext } from './command-palette.overlay.svelte';

	let {
		children,
		lazyMount = true,
		onOpenChange,
		open = $bindable(),
		portalled = true,
		portalRef,
		shortcut = false,
		unmountOnExit = true,
		...props
	}: CommandPaletteRootProps = $props();

	const uid = $props.id();

	const api = createCommandPalette(
		() => ({
			...props,
			lazyMount,
			open,
			shortcut,
			unmountOnExit,
			onOpenChange: (details) => {
				if (open !== undefined) open = details.open;
				onOpenChange?.(details);
			}
		}),
		uid
	);

	setCommandPaletteContext(api);
	setCommandPaletteOverlayContext({
		portalled: () => portalled,
		portalRef: () => portalRef
	});
</script>

{@render children?.()}
