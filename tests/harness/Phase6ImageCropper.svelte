<script lang="ts">
	import {
		ImageCropper,
		ImageCropperCropArea,
		ImageCropperImage,
		ImageCropperViewport,
		type ImageCropperCropChangeDetails,
		type ImageCropperFlipState,
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
		zoom = $bindable(defaultZoom),
		rotation = $bindable(0),
		flip = $bindable<ImageCropperFlipState | undefined>(undefined),
		onCropChange,
		onZoomChange
	}: {
		src?: string;
		aspectRatio?: number;
		cropShape?: 'rectangle' | 'circle';
		fixedCropArea?: boolean;
		initialCrop?: { x: number; y: number; width: number; height: number };
		minZoom?: number;
		maxZoom?: number;
		zoomStep?: number;
		defaultZoom?: number;
		zoom?: number;
		rotation?: number;
		flip?: ImageCropperFlipState;
		onCropChange?: (details: ImageCropperCropChangeDetails) => void;
		onZoomChange?: (details: ImageCropperZoomChangeDetails) => void;
	} = $props();
</script>

<ImageCropper
	{aspectRatio}
	{cropShape}
	{fixedCropArea}
	{initialCrop}
	{minZoom}
	{maxZoom}
	{zoomStep}
	bind:zoom
	bind:rotation
	bind:flip
	{onCropChange}
	{onZoomChange}
>
	<ImageCropperViewport>
		<ImageCropperImage {src} />
		<ImageCropperCropArea />
	</ImageCropperViewport>
	<output data-testid="zoom">{zoom}</output>
	<output data-testid="rotation">{rotation}</output>
	<output data-testid="flip">{`${flip?.horizontal ?? false}-${flip?.vertical ?? false}`}</output>
	<button type="button" data-testid="rotate" onclick={() => (rotation = rotation + 90)}>
		Rotate
	</button>
	<button type="button" data-testid="rotate-back" onclick={() => (rotation = rotation - 90)}>
		Rotate back
	</button>
</ImageCropper>
