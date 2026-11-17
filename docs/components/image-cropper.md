---
title: ImageCropper
component: image-cropper
description: Crop, zoom, rotate, and flip an image before upload.
---

# ImageCropper

Crop, zoom, rotate, and flip an image before upload.

Port of `moduix/packages/svelte/src/components/image-cropper` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `ImageCropper` | `ImageCropper.svelte` |
| `ImageCropperCropArea` | `ImageCropperCropArea.svelte` |
| `ImageCropperGrid` | `ImageCropperGrid.svelte` |
| `ImageCropperHandle` | `ImageCropperHandle.svelte` |
| `ImageCropperImage` | `ImageCropperImage.svelte` |
| `ImageCropperRootProvider` | `ImageCropperRootProvider.svelte` |
| `ImageCropperSelection` | `ImageCropperSelection.svelte` |
| `ImageCropperViewport` | `ImageCropperViewport.svelte` |

## Props

### `ImageCropper` — `ImageCropperRootProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`, and adds to `UseImageCropperProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseImageCropperProps` |
| `ids` | `ImageCropperElementIds` | — | from `UseImageCropperProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseImageCropperProps` |
| `initialCrop` | `Rect` | — | from `UseImageCropperProps` |
| `minWidth` | `number` | — | from `UseImageCropperProps` |
| `minHeight` | `number` | — | from `UseImageCropperProps` |
| `maxWidth` | `number` | — | from `UseImageCropperProps` |
| `maxHeight` | `number` | — | from `UseImageCropperProps` |
| `aspectRatio` | `number` | — | from `UseImageCropperProps` |
| `cropShape` | `'rectangle' \| 'circle'` | — | from `UseImageCropperProps` |
| `zoom` | `number` | — | bindable from `UseImageCropperProps` |
| `rotation` | `number` | — | bindable from `UseImageCropperProps` |
| `flip` | `FlipState` | — | bindable from `UseImageCropperProps` |
| `defaultZoom` | `number` | — | from `UseImageCropperProps` |
| `defaultRotation` | `number` | — | from `UseImageCropperProps` |
| `defaultFlip` | `FlipState` | — | from `UseImageCropperProps` |
| `zoomStep` | `number` | — | from `UseImageCropperProps` |
| `zoomSensitivity` | `number` | — | from `UseImageCropperProps` |
| `minZoom` | `number` | — | from `UseImageCropperProps` |
| `maxZoom` | `number` | — | from `UseImageCropperProps` |
| `nudgeStep` | `number` | — | from `UseImageCropperProps` |
| `nudgeStepShift` | `number` | — | from `UseImageCropperProps` |
| `nudgeStepCtrl` | `number` | — | from `UseImageCropperProps` |
| `fixedCropArea` | `boolean` | — | from `UseImageCropperProps` |
| `translations` | `ImageCropperTranslations` | — | from `UseImageCropperProps` |
| `onZoomChange` | `(details: ImageCropperZoomChangeDetails) => void` | — | from `UseImageCropperProps` |
| `onRotationChange` | `(details: ImageCropperRotationChangeDetails) => void` | — | from `UseImageCropperProps` |
| `onFlipChange` | `(details: ImageCropperFlipChangeDetails) => void` | — | from `UseImageCropperProps` |
| `onCropChange` | `(details: ImageCropperCropChangeDetails) => void` | — | from `UseImageCropperProps` |

### `ImageCropperCropArea` — `ImageCropperCropAreaProps`
adds to `ImageCropperSelectionProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `gridClassName` | `ClassValue` | — |  |
| `handleClassName` | `ClassValue` | — |  |

### `ImageCropperGrid` — `ImageCropperGridProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `ImageCropperGridBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `axis` | `'horizontal' \| 'vertical'` | — | from `ImageCropperGridOptions` |

### `ImageCropperHandle` — `ImageCropperHandleProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `ImageCropperHandleBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `position` | `HandlePosition` | — | from `ImageCropperHandleOptions` |

### `ImageCropperRootProvider` — `ImageCropperRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `ImageCropperRootProviderBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `ImageCropperApi` | — | from `ImageCropperRootProviderBaseProps` |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `ImageCropper` | `image-cropper` | `root` | `image-cropper-root` |
| `ImageCropperGrid` | `image-cropper` | `grid` | `image-cropper-grid` |
| `ImageCropperHandle` | `image-cropper` | `handle` | `image-cropper-handle` |
| `ImageCropperImage` | `image-cropper` | `image` | `image-cropper-image` |
| `ImageCropperRootProvider` | `image-cropper` | `root` | `image-cropper-root-provider` |
| `ImageCropperSelection` | `image-cropper` | `selection` | `image-cropper-selection` |
| `ImageCropperViewport` | `image-cropper` | `viewport` | `image-cropper-viewport` |

## Generated ids

- `image-cropper:${id}`
- `image-cropper:${id}:handle:${id}`
- `image-cropper:${id}:image`
- `image-cropper:${id}:selection`
- `image-cropper:${id}:viewport`
- `inset: ${id}`
- `visibility: ${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		ImageCropper,
		ImageCropperCropArea,
		ImageCropperImage,
		ImageCropperViewport
	} from 'rta-ui';

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
```

## Behaviour covered by tests

- renders every anatomy part with scope, part and slot hooks
- measures the viewport into a centered default crop and writes the css variables
- applies the aspect ratio to the crop area
- zooms with the wheel and clamps between minZoom and maxZoom
- resizes the crop from a handle using ownerDocument pointer events
- moves the crop area by dragging the selection, clamped to the viewport
- nudges and resizes the crop from the keyboard, and zooms with plus
- keeps the zoom, rotation and flip props controlled by the root
- pans the image over a fixed crop area and reports panning
- exposes the api: crop data, rotation, flip, reset and a null export

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
