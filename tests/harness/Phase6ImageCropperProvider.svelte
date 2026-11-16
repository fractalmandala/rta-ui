<script lang="ts">
	import {
		ImageCropperCropArea,
		ImageCropperImage,
		ImageCropperRootProvider,
		ImageCropperViewport,
		createImageCropper,
		type ImageCropperCropChangeDetails,
		type ImageCropperFlipState,
		type ImageCropperRect,
		type ImageCropperZoomChangeDetails
	} from '../../src/lib/components/image-cropper/index';

	let {
		src = 'photo.png',
		aspectRatio,
		cropShape,
		fixedCropArea = false,
		initialCrop,
		minZoom,
		maxZoom,
		zoomStep,
		defaultZoom = 1,
		defaultRotation = 0,
		defaultFlip,
		onCropChange,
		onZoomChange
	}: {
		src?: string;
		aspectRatio?: number;
		cropShape?: 'rectangle' | 'circle';
		fixedCropArea?: boolean;
		initialCrop?: ImageCropperRect;
		minZoom?: number;
		maxZoom?: number;
		zoomStep?: number;
		defaultZoom?: number;
		defaultRotation?: number;
		defaultFlip?: ImageCropperFlipState;
		onCropChange?: (details: ImageCropperCropChangeDetails) => void;
		onZoomChange?: (details: ImageCropperZoomChangeDetails) => void;
	} = $props();

	const api = createImageCropper(
		() => ({
			aspectRatio,
			cropShape,
			defaultFlip,
			defaultRotation,
			defaultZoom,
			fixedCropArea,
			initialCrop,
			maxZoom,
			minZoom,
			zoomStep,
			onCropChange,
			onZoomChange
		}),
		'cropper'
	);

	let exported = $state('none');
	let cropData = $state('none');

	async function runExport() {
		const result = await api.getCroppedImage();
		exported = result === null ? 'null' : typeof result;
	}

	function readCropData() {
		const data = api.getCropData();
		cropData = `${data.x},${data.y},${data.width},${data.height}`;
	}
</script>

<ImageCropperRootProvider value={api}>
	<ImageCropperViewport>
		<ImageCropperImage {src} />
		<ImageCropperCropArea />
	</ImageCropperViewport>
	<output data-testid="zoom">{api.zoom}</output>
	<output data-testid="rotation">{api.rotation}</output>
	<output data-testid="flip">{`${api.flip.horizontal}-${api.flip.vertical}`}</output>
	<output data-testid="crop">{`${api.crop.x},${api.crop.y},${api.crop.width},${api.crop.height}`}</output>
	<output data-testid="viewport-size">{`${api.viewportSize.width}x${api.viewportSize.height}`}</output>
	<output data-testid="dragging">{api.dragging}</output>
	<output data-testid="panning">{api.panning}</output>
	<output data-testid="exported">{exported}</output>
	<output data-testid="crop-data">{cropData}</output>
	<button type="button" data-testid="export" onclick={runExport}>Export</button>
	<button type="button" data-testid="read-crop" onclick={readCropData}>Crop data</button>
	<button type="button" data-testid="zoom-in" onclick={() => api.zoomBy(0.5)}>Zoom in</button>
	<button type="button" data-testid="rotate" onclick={() => api.rotateBy(90)}>Rotate</button>
	<button type="button" data-testid="flip-x" onclick={() => api.flipHorizontally()}>Flip X</button>
	<button type="button" data-testid="reset" onclick={() => api.reset()}>Reset</button>
</ImageCropperRootProvider>
