<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UseTooltipProps } from './tooltip.state.svelte';

	export interface TooltipRootProps extends UseTooltipProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createTooltip, setTooltipContext } from './tooltip.state.svelte';

	let {
		children,
		open = $bindable(),
		onOpenChange,
		onTriggerValueChange,
		triggerValue = $bindable(),
		...props
	}: TooltipRootProps = $props();

	const uid = $props.id();
	const api = createTooltip(
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
	setTooltipContext(api);
</script>

{@render children?.()}
