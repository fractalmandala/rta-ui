<script lang="ts">
	import Tooltip from '../../src/lib/components/tooltip/Tooltip.svelte';
	import TooltipArrow from '../../src/lib/components/tooltip/TooltipArrow.svelte';
	import TooltipBody from '../../src/lib/components/tooltip/TooltipBody.svelte';
	import TooltipContent from '../../src/lib/components/tooltip/TooltipContent.svelte';
	import TooltipDisabledTrigger from '../../src/lib/components/tooltip/TooltipDisabledTrigger.svelte';
	import TooltipPositioner from '../../src/lib/components/tooltip/TooltipPositioner.svelte';
	import TooltipTrigger from '../../src/lib/components/tooltip/TooltipTrigger.svelte';
	import type { TooltipOpenChangeDetails, UseTooltipProps } from '../../src/lib/components/tooltip';

	let {
		open = $bindable(undefined),
		defaultOpen = undefined,
		openDelay = undefined,
		closeDelay = undefined,
		interactive = undefined,
		closeOnEscape = undefined,
		closeOnPointerDown = undefined,
		positioning = undefined,
		portalled = undefined,
		body = false,
		twoTriggers = false,
		disabledTrigger = false,
		onOpenChange = undefined
	}: {
		open?: boolean;
		defaultOpen?: boolean;
		openDelay?: number;
		closeDelay?: number;
		interactive?: boolean;
		closeOnEscape?: boolean;
		closeOnPointerDown?: boolean;
		positioning?: UseTooltipProps['positioning'];
		portalled?: boolean;
		body?: boolean;
		twoTriggers?: boolean;
		disabledTrigger?: boolean;
		onOpenChange?: (details: TooltipOpenChangeDetails) => void;
	} = $props();
</script>

<Tooltip
	{open}
	{defaultOpen}
	{openDelay}
	{closeDelay}
	{interactive}
	{closeOnEscape}
	{closeOnPointerDown}
	{positioning}
	{portalled}
	{onOpenChange}
>
	{#if twoTriggers}
		<TooltipTrigger value="save">Save</TooltipTrigger>
		<TooltipTrigger value="publish">Publish</TooltipTrigger>
	{:else if disabledTrigger}
		<TooltipDisabledTrigger>
			<button type="button" disabled>Save</button>
		</TooltipDisabledTrigger>
	{:else}
		<TooltipTrigger>Save</TooltipTrigger>
	{/if}
	{#if body}
		<TooltipBody>
			<TooltipArrow />
			Saves your changes
		</TooltipBody>
	{:else}
		<TooltipPositioner>
			<TooltipContent>
				<TooltipArrow />
				Saves your changes
			</TooltipContent>
		</TooltipPositioner>
	{/if}
</Tooltip>

<button type="button">Outside</button>
