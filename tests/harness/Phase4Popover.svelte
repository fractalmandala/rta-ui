<script lang="ts">
	import Popover from '../../src/lib/components/popover/Popover.svelte';
	import PopoverAnchor from '../../src/lib/components/popover/PopoverAnchor.svelte';
	import PopoverArrow from '../../src/lib/components/popover/PopoverArrow.svelte';
	import PopoverBody from '../../src/lib/components/popover/PopoverBody.svelte';
	import PopoverCloseIcon from '../../src/lib/components/popover/PopoverCloseIcon.svelte';
	import PopoverCloseTrigger from '../../src/lib/components/popover/PopoverCloseTrigger.svelte';
	import PopoverContent from '../../src/lib/components/popover/PopoverContent.svelte';
	import PopoverDescription from '../../src/lib/components/popover/PopoverDescription.svelte';
	import PopoverFooter from '../../src/lib/components/popover/PopoverFooter.svelte';
	import PopoverHeader from '../../src/lib/components/popover/PopoverHeader.svelte';
	import PopoverIndicator from '../../src/lib/components/popover/PopoverIndicator.svelte';
	import PopoverPositioner from '../../src/lib/components/popover/PopoverPositioner.svelte';
	import PopoverTitle from '../../src/lib/components/popover/PopoverTitle.svelte';
	import PopoverTrigger from '../../src/lib/components/popover/PopoverTrigger.svelte';
	import type { PopoverOpenChangeDetails, UsePopoverProps } from '../../src/lib/components/popover';

	let {
		open = $bindable(undefined),
		defaultOpen = undefined,
		modal = false,
		portalled = true,
		positioning = undefined,
		closeOnEscape = undefined,
		closeOnInteractOutside = undefined,
		autoFocus = undefined,
		lazyMount = undefined,
		unmountOnExit = undefined,
		withAnchor = false,
		withCloseIcon = false,
		onOpenChange = undefined
	}: {
		open?: boolean;
		defaultOpen?: boolean;
		modal?: boolean;
		portalled?: boolean;
		positioning?: UsePopoverProps['positioning'];
		closeOnEscape?: boolean;
		closeOnInteractOutside?: boolean;
		autoFocus?: boolean;
		lazyMount?: boolean;
		unmountOnExit?: boolean;
		withAnchor?: boolean;
		withCloseIcon?: boolean;
		onOpenChange?: (details: PopoverOpenChangeDetails) => void;
	} = $props();
</script>

<Popover
	{open}
	{defaultOpen}
	{modal}
	{portalled}
	{positioning}
	{closeOnEscape}
	{closeOnInteractOutside}
	{autoFocus}
	{lazyMount}
	{unmountOnExit}
	{onOpenChange}
>
	{#if withAnchor}
		<PopoverAnchor>Anchor area</PopoverAnchor>
	{/if}
	<PopoverTrigger>
		Open settings
		<PopoverIndicator />
	</PopoverTrigger>
	<PopoverPositioner>
		<PopoverContent>
			<PopoverArrow />
			<PopoverHeader>
				<PopoverTitle>Notification settings</PopoverTitle>
				<PopoverDescription>Choose when we email you.</PopoverDescription>
			</PopoverHeader>
			<PopoverBody>
				<label><input type="checkbox" /> Weekly digest</label>
			</PopoverBody>
			<PopoverFooter>
				<PopoverCloseTrigger>Done</PopoverCloseTrigger>
			</PopoverFooter>
			{#if withCloseIcon}
				<PopoverCloseIcon />
			{/if}
		</PopoverContent>
	</PopoverPositioner>
</Popover>

<button type="button">Outside</button>
