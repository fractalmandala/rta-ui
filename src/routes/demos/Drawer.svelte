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
		DrawerTrigger
	} from '../../lib/components/drawer/index';
	import Button from '../../lib/components/button/Button.svelte';
</script>

<Drawer snapPoints={[0.5, 1]} defaultSnapPoint={0.5}>
	<DrawerTrigger>Open filters</DrawerTrigger>
	<DrawerSwipeArea />
	<DrawerBackdrop />
	<DrawerPositioner>
		<DrawerContent size="md">
			<DrawerGrabber><DrawerGrabberIndicator /></DrawerGrabber>
			<DrawerHeader>
				<DrawerTitle>Filters</DrawerTitle>
				<DrawerDescription>Drag the handle to change the height.</DrawerDescription>
			</DrawerHeader>
			<DrawerBody>Status, owner, and label filters live here.</DrawerBody>
			<DrawerFooter>
				<DrawerCloseTrigger>Reset</DrawerCloseTrigger>
				<Button>Apply</Button>
			</DrawerFooter>
			<DrawerCloseIcon />
		</DrawerContent>
	</DrawerPositioner>
</Drawer>
