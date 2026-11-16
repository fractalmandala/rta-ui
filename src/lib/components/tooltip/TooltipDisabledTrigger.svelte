<script module lang="ts">
	import type { HTMLProps, RefAttribute } from '../../internal/types';

	export interface TooltipDisabledTriggerProps extends HTMLProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import type { PropsFn } from '../../internal/types';
	import { cn } from '../../internal/cn.js';
	import styles from './Tooltip.module.css';
	import TooltipTrigger from './TooltipTrigger.svelte';

	let {
		children,
		class: className,
		ref = $bindable(null),
		tabindex = 0,
		...props
	}: TooltipDisabledTriggerProps = $props();

	let node = $state<HTMLSpanElement | null>(null);

	$effect(() => {
		ref = node;
		return () => {
			ref = null;
		};
	});
</script>

{#snippet asChild(triggerProps: PropsFn<'button'>)}
	{@const merged = (triggerProps as unknown as (props: Record<string, unknown>) => Record<
		string,
		unknown
	>)({
		...props,
		tabindex,
		class: cn(styles.disabledTrigger, className)
	})}
	<span
		{...merged}
		bind:this={node}
		data-slot="tooltip-disabled-trigger"
	>
		{@render children?.()}
	</span>
{/snippet}

<TooltipTrigger asChild={asChild} />
