<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UseDialogProps } from './dialog.state.svelte';

	export interface DialogRootProps extends UseDialogProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createDialog, setDialogContext } from './dialog.state.svelte';
	import { setDialogOverlayContext } from './dialog.overlay.svelte';

	let {
		children,
		lazyMount = true,
		onOpenChange,
		open = $bindable(),
		portalled = true,
		portalRef,
		triggerValue = $bindable(),
		unmountOnExit = true,
		...props
	}: DialogRootProps = $props();

	const uid = $props.id();

	const api = createDialog(
		() => ({
			...props,
			lazyMount,
			open,
			portalled,
			portalRef,
			triggerValue,
			unmountOnExit,
			onOpenChange: (details) => {
				if (open !== undefined) open = details.open;
				onOpenChange?.(details);
			}
		}),
		uid
	);

	setDialogContext(api);
	setDialogOverlayContext({
		portalled: () => portalled,
		portalRef: () => portalRef
	});
</script>

{@render children?.()}
