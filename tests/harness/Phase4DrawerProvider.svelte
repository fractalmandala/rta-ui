<script lang="ts">
	import { untrack } from 'svelte';
	import {
		DrawerBackdrop,
		DrawerBody,
		DrawerContent,
		DrawerDescription,
		DrawerGrabber,
		DrawerGrabberIndicator,
		DrawerHeader,
		DrawerPositioner,
		DrawerRootProvider,
		DrawerTitle,
		DrawerTrigger,
		createDrawer,
		type DrawerApi,
		type DrawerSnapPoint
	} from '../../src/lib/components/drawer/index';

	let {
		defaultSnapPoint = undefined,
		onApi = undefined,
		snapPoints = undefined
	}: {
		defaultSnapPoint?: DrawerSnapPoint | null;
		onApi?: (api: DrawerApi) => void;
		snapPoints?: DrawerSnapPoint[];
	} = $props();

	const uid = $props.id();
	const api = createDrawer(() => ({ defaultSnapPoint, snapPoints }), uid);

	untrack(() => onApi)?.(api);
</script>

<DrawerRootProvider value={api}>
	<DrawerTrigger>Open drawer</DrawerTrigger>
	<DrawerBackdrop />
	<DrawerPositioner>
		<DrawerContent>
			<DrawerGrabber><DrawerGrabberIndicator /></DrawerGrabber>
			<DrawerHeader>
				<DrawerTitle>Snap points</DrawerTitle>
				<DrawerDescription>Drag to move between snap points.</DrawerDescription>
			</DrawerHeader>
			<DrawerBody>Body content</DrawerBody>
		</DrawerContent>
	</DrawerPositioner>
</DrawerRootProvider>
