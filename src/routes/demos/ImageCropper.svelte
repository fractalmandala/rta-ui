<script lang="ts">
	import {
		ImageCropper,
		ImageCropperCropArea,
		ImageCropperImage,
		ImageCropperViewport
	} from '../../lib/index';

	const src =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><circle cx="400" cy="250" r="140" fill="rgb(255 255 255 / 55%)"/></svg>'
		);

	let zoom = $state(1);
	let rotation = $state(0);
	let flip = $state({ horizontal: false, vertical: false });
	let aspectRatio = $state<number | undefined>(16 / 9);
</script>

<div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 32rem">
	<ImageCropper
		bind:zoom
		bind:rotation
		bind:flip
		{aspectRatio}
		minZoom={1}
		maxZoom={4}
		zoomStep={0.1}
	>
		<ImageCropperViewport>
			<ImageCropperImage {src} />
			<ImageCropperCropArea />
		</ImageCropperViewport>
	</ImageCropper>

	<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
		<button type="button" onclick={() => (zoom = Math.min(4, Number((zoom + 0.1).toFixed(2))))}>
			Zoom in
		</button>
		<button type="button" onclick={() => (zoom = Math.max(1, Number((zoom - 0.1).toFixed(2))))}>
			Zoom out
		</button>
		<button type="button" onclick={() => (rotation = (rotation + 90) % 360)}>Rotate</button>
		<button type="button" onclick={() => (flip = { ...flip, horizontal: !flip.horizontal })}>
			Flip horizontally
		</button>
		<button type="button" onclick={() => (aspectRatio = aspectRatio ? undefined : 1)}>
			{aspectRatio ? 'Free crop' : 'Square crop'}
		</button>
	</div>

	<p style="font-size: 0.75rem; opacity: 0.7">
		zoom {zoom.toFixed(2)} · rotation {rotation}° · flip {flip.horizontal ? 'x' : '—'}
	</p>
</div>
