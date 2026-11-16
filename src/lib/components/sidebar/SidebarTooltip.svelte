<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PropsFn } from '../../internal/types';
	import type { PositionOptions } from '../../internal/positioning.svelte';
	import type { TooltipRootProps } from '../tooltip/Tooltip.svelte';

	export interface SidebarTooltipProps
		extends Omit<TooltipRootProps, 'children' | 'disabled' | 'positioning'> {
		/** Renders the trigger element; only shown while the sidebar is collapsed. */
		children?: Snippet<[PropsFn<'button'>]>;
		content?: string | number | Snippet;
		positioning?: PositionOptions;
		openDelay?: number;
		closeDelay?: number;
	}

	export type SidebarTooltipTriggerProps = HTMLProps<'button'>;
</script>

<script lang="ts">
	import Tooltip from '../tooltip/Tooltip.svelte';
	import TooltipContent from '../tooltip/TooltipContent.svelte';
	import TooltipPositioner from '../tooltip/TooltipPositioner.svelte';
	import TooltipTrigger from '../tooltip/TooltipTrigger.svelte';
	import { useSidebarContext } from './sidebar.state.svelte';

	let {
		children,
		closeDelay = 0,
		content,
		open = $bindable(),
		openDelay = 200,
		positioning,
		triggerValue = $bindable(),
		...props
	}: SidebarTooltipProps = $props();

	const api = useSidebarContext();
	const resolvedPositioning = $derived<PositionOptions>({
		placement: api.side === 'left' ? 'right' : 'left',
		gutter: 8,
		...positioning
	});
</script>

<Tooltip
	{...props}
	bind:open
	bind:triggerValue
	{closeDelay}
	{openDelay}
	disabled={!api.collapsed}
	positioning={resolvedPositioning}
>
	<TooltipTrigger>
		{#snippet asChild(triggerProps)}
			{@render children?.(triggerProps)}
		{/snippet}
	</TooltipTrigger>
	<TooltipPositioner>
		<TooltipContent>
			{#if typeof content === 'function'}
				{@render content()}
			{:else}
				{content}
			{/if}
		</TooltipContent>
	</TooltipPositioner>
</Tooltip>
