<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UsePopoverProps } from './popover.state.svelte';

	export interface PopoverRootProps extends UsePopoverProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createPopover, setPopoverContext } from './popover.state.svelte';

	let {
		children,
		open = $bindable(),
		onOpenChange,
		onTriggerValueChange,
		triggerValue = $bindable(),
		...props
	}: PopoverRootProps = $props();

	const uid = $props.id();
	const api = createPopover(
		() => ({
			...props,
			open,
			triggerValue,
			onOpenChange(details) {
				onOpenChange?.(details);
				if (open !== undefined) open = details.open;
			},
			onTriggerValueChange(details) {
				onTriggerValueChange?.(details);
				if (triggerValue !== undefined) triggerValue = details.value;
			}
		}),
		uid
	);
	setPopoverContext(api);
</script>

{@render children?.()}
