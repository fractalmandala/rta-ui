<script lang="ts">
	import FloatingPanel from '../../lib/components/floating-panel/FloatingPanel.svelte';
	import FloatingPanelBody from '../../lib/components/floating-panel/FloatingPanelBody.svelte';
	import FloatingPanelCloseIcon from '../../lib/components/floating-panel/FloatingPanelCloseIcon.svelte';
	import FloatingPanelContent from '../../lib/components/floating-panel/FloatingPanelContent.svelte';
	import FloatingPanelControl from '../../lib/components/floating-panel/FloatingPanelControl.svelte';
	import FloatingPanelDragIndicator from '../../lib/components/floating-panel/FloatingPanelDragIndicator.svelte';
	import FloatingPanelDragTrigger from '../../lib/components/floating-panel/FloatingPanelDragTrigger.svelte';
	import FloatingPanelFooter from '../../lib/components/floating-panel/FloatingPanelFooter.svelte';
	import FloatingPanelHeader from '../../lib/components/floating-panel/FloatingPanelHeader.svelte';
	import FloatingPanelPositioner from '../../lib/components/floating-panel/FloatingPanelPositioner.svelte';
	import FloatingPanelResizeTriggerGroup from '../../lib/components/floating-panel/FloatingPanelResizeTriggerGroup.svelte';
	import FloatingPanelStageTrigger from '../../lib/components/floating-panel/FloatingPanelStageTrigger.svelte';
	import FloatingPanelTitle from '../../lib/components/floating-panel/FloatingPanelTitle.svelte';
	import FloatingPanelTrigger from '../../lib/components/floating-panel/FloatingPanelTrigger.svelte';

	let open = $state(false);
</script>

<p>Open: {open ? 'yes' : 'no'}</p>

<FloatingPanel bind:open defaultPosition={{ x: 120, y: 80 }} minSize={{ width: 240, height: 160 }}>
	<FloatingPanelTrigger>Scratchpad</FloatingPanelTrigger>
	<FloatingPanelPositioner>
		<FloatingPanelContent>
			<FloatingPanelHeader>
				<FloatingPanelDragTrigger>
					<FloatingPanelDragIndicator />
				</FloatingPanelDragTrigger>
				<FloatingPanelTitle>Scratchpad</FloatingPanelTitle>
				<FloatingPanelControl>
					<FloatingPanelStageTrigger stage="minimized" />
					<FloatingPanelStageTrigger stage="maximized" />
					<FloatingPanelStageTrigger stage="default" />
					<FloatingPanelCloseIcon />
				</FloatingPanelControl>
			</FloatingPanelHeader>
			<FloatingPanelBody>
				<p>Drag the header, resize from any edge, or use the arrow keys.</p>
			</FloatingPanelBody>
			<FloatingPanelFooter>min 240 x 160</FloatingPanelFooter>
			<FloatingPanelResizeTriggerGroup />
		</FloatingPanelContent>
	</FloatingPanelPositioner>
</FloatingPanel>
