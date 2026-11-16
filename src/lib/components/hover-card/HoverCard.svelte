<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { UseHoverCardProps } from './hover-card.state.svelte';

	export interface HoverCardRootProps extends UseHoverCardProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createHoverCard, setHoverCardContext } from './hover-card.state.svelte';

	let {
		children,
		open = $bindable(),
		onOpenChange,
		onTriggerValueChange,
		triggerValue = $bindable(),
		...props
	}: HoverCardRootProps = $props();

	const uid = $props.id();
	const api = createHoverCard(
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
	setHoverCardContext(api);
</script>

{@render children?.()}
