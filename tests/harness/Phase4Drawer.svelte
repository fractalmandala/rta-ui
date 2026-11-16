<script lang="ts">
	import {
		Drawer,
		DrawerBackdrop,
		DrawerBody,
		DrawerCloseIcon,
		DrawerCloseTrigger,
		DrawerContent,
		DrawerDescription,
		DrawerFooter,
		DrawerGrabber,
		DrawerGrabberIndicator,
		DrawerHeader,
		DrawerPositioner,
		DrawerSwipeArea,
		DrawerTitle,
		DrawerTrigger,
		type DrawerOpenChangeDetails,
		type DrawerSnapPoint
	} from '../../src/lib/components/drawer/index';

	let {
		defaultOpen = false,
		draggable = true,
		defaultSnapPoint = undefined,
		modal = true,
		onOpenChange = undefined,
		open = $bindable(undefined),
		showDescription = true,
		snapPoints = undefined,
		snapToSequentialPoints = false,
		swipeDirection = undefined
	}: {
		defaultOpen?: boolean;
		draggable?: boolean;
		defaultSnapPoint?: DrawerSnapPoint | null;
		modal?: boolean;
		onOpenChange?: (details: DrawerOpenChangeDetails) => void;
		open?: boolean;
		showDescription?: boolean;
		snapPoints?: DrawerSnapPoint[];
		snapToSequentialPoints?: boolean;
		swipeDirection?: 'up' | 'down' | 'start' | 'end';
	} = $props();
</script>

<Drawer
	bind:open
	{defaultOpen}
	{defaultSnapPoint}
	{modal}
	{snapPoints}
	{snapToSequentialPoints}
	{swipeDirection}
	onOpenChange={(details) => onOpenChange?.(details)}
>
	<DrawerTrigger>Open drawer</DrawerTrigger>
	<DrawerSwipeArea />
	<DrawerBackdrop />
	<DrawerPositioner>
		<DrawerContent {draggable}>
			<DrawerGrabber><DrawerGrabberIndicator /></DrawerGrabber>
			<DrawerHeader>
				<DrawerTitle>Filters</DrawerTitle>
				{#if showDescription}
					<DrawerDescription>Narrow the list down.</DrawerDescription>
				{/if}
			</DrawerHeader>
			<DrawerBody>Body content</DrawerBody>
			<DrawerFooter>
				<DrawerCloseTrigger>Apply</DrawerCloseTrigger>
			</DrawerFooter>
			<DrawerCloseIcon />
		</DrawerContent>
	</DrawerPositioner>
</Drawer>
