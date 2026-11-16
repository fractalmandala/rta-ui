<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UseFloatingPanelProps } from './floating-panel.state.svelte';

	export interface FloatingPanelRootProps extends UseFloatingPanelProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createFloatingPanel, setFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		children,
		onOpenChange,
		onPositionChange,
		onSizeChange,
		open = $bindable(),
		position = $bindable(),
		size = $bindable(),
		...props
	}: FloatingPanelRootProps = $props();

	const uid = $props.id();
	const api = createFloatingPanel(
		() => ({
			...props,
			open,
			position,
			size,
			onOpenChange(details) {
				onOpenChange?.(details);
				if (open !== undefined) open = details.open;
			},
			onPositionChange(details) {
				onPositionChange?.(details);
				if (position !== undefined) position = details.position;
			},
			onSizeChange(details) {
				onSizeChange?.(details);
				if (size !== undefined) size = details.size;
			}
		}),
		uid
	);
	setFloatingPanelContext(api);
</script>

{@render children?.()}
