<script lang="ts">
	import FloatingPanel from '../../src/lib/components/floating-panel/FloatingPanel.svelte';
	import FloatingPanelBody from '../../src/lib/components/floating-panel/FloatingPanelBody.svelte';
	import FloatingPanelCloseIcon from '../../src/lib/components/floating-panel/FloatingPanelCloseIcon.svelte';
	import FloatingPanelContent from '../../src/lib/components/floating-panel/FloatingPanelContent.svelte';
	import FloatingPanelControl from '../../src/lib/components/floating-panel/FloatingPanelControl.svelte';
	import FloatingPanelDragIndicator from '../../src/lib/components/floating-panel/FloatingPanelDragIndicator.svelte';
	import FloatingPanelDragTrigger from '../../src/lib/components/floating-panel/FloatingPanelDragTrigger.svelte';
	import FloatingPanelFooter from '../../src/lib/components/floating-panel/FloatingPanelFooter.svelte';
	import FloatingPanelHeader from '../../src/lib/components/floating-panel/FloatingPanelHeader.svelte';
	import FloatingPanelPositioner from '../../src/lib/components/floating-panel/FloatingPanelPositioner.svelte';
	import FloatingPanelResizeTriggerGroup from '../../src/lib/components/floating-panel/FloatingPanelResizeTriggerGroup.svelte';
	import FloatingPanelStageTrigger from '../../src/lib/components/floating-panel/FloatingPanelStageTrigger.svelte';
	import FloatingPanelTitle from '../../src/lib/components/floating-panel/FloatingPanelTitle.svelte';
	import FloatingPanelTrigger from '../../src/lib/components/floating-panel/FloatingPanelTrigger.svelte';
	import type {
		FloatingPanelOpenChangeDetails,
		FloatingPanelPoint,
		FloatingPanelPositionChangeDetails,
		FloatingPanelSize,
		FloatingPanelSizeChangeDetails,
		FloatingPanelStageChangeDetails
	} from '../../src/lib/components/floating-panel';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		defaultSize = undefined,
		defaultPosition = undefined,
		minSize = undefined,
		maxSize = undefined,
		portalled = true,
		closeOnEscape = true,
		persistRect = true,
		resizable = true,
		draggable = true,
		gridSize = undefined,
		withFooter = true,
		onOpenChange = undefined,
		onPositionChange = undefined,
		onPositionChangeEnd = undefined,
		onSizeChange = undefined,
		onSizeChangeEnd = undefined,
		onStageChange = undefined
	}: {
		open?: boolean;
		defaultOpen?: boolean;
		defaultSize?: FloatingPanelSize;
		defaultPosition?: FloatingPanelPoint;
		minSize?: FloatingPanelSize;
		maxSize?: FloatingPanelSize;
		portalled?: boolean;
		closeOnEscape?: boolean;
		persistRect?: boolean;
		resizable?: boolean;
		draggable?: boolean;
		gridSize?: number;
		withFooter?: boolean;
		onOpenChange?: (details: FloatingPanelOpenChangeDetails) => void;
		onPositionChange?: (details: FloatingPanelPositionChangeDetails) => void;
		onPositionChangeEnd?: (details: FloatingPanelPositionChangeDetails) => void;
		onSizeChange?: (details: FloatingPanelSizeChangeDetails) => void;
		onSizeChangeEnd?: (details: FloatingPanelSizeChangeDetails) => void;
		onStageChange?: (details: FloatingPanelStageChangeDetails) => void;
	} = $props();
</script>

<FloatingPanel
	{open}
	{defaultOpen}
	{defaultSize}
	{defaultPosition}
	{minSize}
	{maxSize}
	{portalled}
	{closeOnEscape}
	{persistRect}
	{resizable}
	{draggable}
	{gridSize}
	{onOpenChange}
	{onPositionChange}
	{onPositionChangeEnd}
	{onSizeChange}
	{onSizeChangeEnd}
	{onStageChange}
>
	<FloatingPanelTrigger>Open panel</FloatingPanelTrigger>
	<FloatingPanelPositioner>
		<FloatingPanelContent>
			<FloatingPanelHeader>
				<FloatingPanelDragTrigger>
					<FloatingPanelDragIndicator />
				</FloatingPanelDragTrigger>
				<FloatingPanelTitle>Panel title</FloatingPanelTitle>
				<FloatingPanelControl>
					<FloatingPanelStageTrigger stage="minimized" />
					<FloatingPanelStageTrigger stage="maximized" />
					<FloatingPanelStageTrigger stage="default" />
					<FloatingPanelCloseIcon />
				</FloatingPanelControl>
			</FloatingPanelHeader>
			<FloatingPanelBody>Panel body</FloatingPanelBody>
			{#if withFooter}
				<FloatingPanelFooter>Panel footer</FloatingPanelFooter>
			{/if}
			<FloatingPanelResizeTriggerGroup />
		</FloatingPanelContent>
	</FloatingPanelPositioner>
</FloatingPanel>

<button type="button">Outside</button>
