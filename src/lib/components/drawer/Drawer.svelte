<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UseDrawerProps } from './drawer.state.svelte';

	export interface DrawerRootProps extends UseDrawerProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createDrawer, setDrawerContext } from './drawer.state.svelte';
	import { setDrawerOverlayContext } from './drawer.overlay.svelte';
	import { useDrawerStackStore } from './drawer.stack.svelte';

	let {
		children,
		lazyMount = true,
		onOpenChange,
		onSnapPointChange,
		onTriggerValueChange,
		open = $bindable(),
		portalled = true,
		portalRef,
		snapPoint = $bindable(),
		triggerValue = $bindable(),
		unmountOnExit = true,
		...props
	}: DrawerRootProps = $props();

	const uid = $props.id();
	const stack = useDrawerStackStore();

	const api = createDrawer(
		() => ({
			...props,
			lazyMount,
			open,
			portalled,
			portalRef,
			snapPoint,
			stack,
			triggerValue,
			unmountOnExit,
			onOpenChange: (details) => {
				if (open !== undefined) open = details.open;
				onOpenChange?.(details);
			},
			onSnapPointChange: (details) => {
				if (snapPoint !== undefined) snapPoint = details.snapPoint;
				onSnapPointChange?.(details);
			},
			onTriggerValueChange: (details) => {
				if (triggerValue !== undefined) triggerValue = details.value;
				onTriggerValueChange?.(details);
			}
		}),
		uid
	);

	setDrawerContext(api);
	setDrawerOverlayContext({ portalled: () => portalled, portalRef: () => portalRef });
</script>

{@render children?.()}
