---
title: Lightbox
component: lightbox
description: View images in a modal viewer, one at a time or as a gallery.
---

# Lightbox

View images in a modal viewer, one at a time or as a gallery.

Port of `moduix/packages/svelte/src/components/lightbox` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `Lightbox` | `Lightbox.svelte` |
| `LightboxBackdrop` | `LightboxBackdrop.svelte` |
| `LightboxBind` | `LightboxBind.svelte` |
| `LightboxBody` | `LightboxBody.svelte` |
| `LightboxCaption` | `LightboxCaption.svelte` |
| `LightboxCloseIcon` | `LightboxCloseIcon.svelte` |
| `LightboxCloseTrigger` | `LightboxCloseTrigger.svelte` |
| `LightboxContent` | `LightboxContent.svelte` |
| `LightboxCounter` | `LightboxCounter.svelte` |
| `LightboxDescription` | `LightboxDescription.svelte` |
| `LightboxDownloadTrigger` | `LightboxDownloadTrigger.svelte` |
| `LightboxFooter` | `LightboxFooter.svelte` |
| `LightboxGallery` | `LightboxGallery.svelte` |
| `LightboxHeader` | `LightboxHeader.svelte` |
| `LightboxImage` | `LightboxImage.svelte` |
| `LightboxNextTrigger` | `LightboxNextTrigger.svelte` |
| `LightboxPositioner` | `LightboxPositioner.svelte` |
| `LightboxPrevTrigger` | `LightboxPrevTrigger.svelte` |
| `LightboxRootProvider` | `LightboxRootProvider.svelte` |
| `LightboxThumbnails` | `LightboxThumbnails.svelte` |
| `LightboxTitle` | `LightboxTitle.svelte` |
| `LightboxTrigger` | `LightboxTrigger.svelte` |
| `LightboxViewport` | `LightboxViewport.svelte` |
| `LightboxZoomTrigger` | `LightboxZoomTrigger.svelte` |

`LightboxBind` renders no element of its own: it creates the state and provides it to the other parts.

## Props

### `Lightbox` — `LightboxRootProps`
adds to `Omit<DialogRootProps, 'children' | 'ids'>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `sources` | `LightboxSource[]` | — | Images the gallery navigates through. |
| `index` | `number` | — | bindable |
| `defaultIndex` | `number` | — |  |
| `onIndexChange` | `(details: LightboxIndexChangeDetails) => void` | — |  |
| `loop` | `boolean` | `false` |  |
| `zoom` | `number` | — | bindable |
| `defaultZoom` | `number` | — |  |
| `minZoom` | `number` | — |  |
| `maxZoom` | `number` | — |  |
| `zoomStep` | `number` | — |  |
| `onZoomChange` | `(details: LightboxZoomChangeDetails) => void` | — |  |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — |  |
| `id` | `string \| null` | — |  |
| `ids` | `LightboxElementIds` | — |  |
| `translations` | `LightboxTranslations` | — |  |
| `children` | `Snippet` | — |  |

### `LightboxImage` — `LightboxImageProps`
adds to `HTMLImgAttributes`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `closeOnClick` | `boolean` | `false` | Close the lightbox when the image is clicked. |
| `ref` | `HTMLImageElement \| null` | — | The rendered <img> element. bindable |

### `LightboxNextTrigger` — `LightboxNextTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep the trigger enabled at the last image when the gallery loops. |

### `LightboxPrevTrigger` — `LightboxPrevTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep the trigger enabled at the first image when the gallery loops. |

### `LightboxRootProvider` — `LightboxRootProviderProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `DialogApi` | — |  |
| `lightbox` | `LightboxApi` | — |  |
| `portalled` | `boolean` | `true` |  |
| `portalRef` | `DialogPortalTarget` | — |  |
| `children` | `Snippet` | — |  |

### `LightboxZoomTrigger` — `LightboxZoomTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `PolymorphicProps<'button'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `mode` | `LightboxZoomMode` | `'toggle'` |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `LightboxBackdrop` | `—` | `—` | `lightbox-backdrop` |
| `LightboxBody` | `lightbox` | `body` | `lightbox-body` |
| `LightboxCaption` | `lightbox` | `caption` | `lightbox-caption` |
| `LightboxCloseIcon` | `—` | `—` | `lightbox-close-icon` |
| `LightboxCloseTrigger` | `—` | `—` | `lightbox-close-trigger` |
| `LightboxContent` | `—` | `—` | `lightbox-content` |
| `LightboxCounter` | `lightbox` | `counter` | `lightbox-counter` |
| `LightboxDescription` | `—` | `—` | `lightbox-description` |
| `LightboxDownloadTrigger` | `lightbox` | `download-trigger` | `lightbox-download-trigger` |
| `LightboxFooter` | `lightbox` | `footer` | `lightbox-footer` |
| `LightboxGallery` | `lightbox` | `gallery` | `lightbox-gallery` |
| `LightboxHeader` | `lightbox` | `header` | `lightbox-header` |
| `LightboxImage` | `lightbox` | `image` | `lightbox-image` |
| `LightboxNextTrigger` | `lightbox` | `next-trigger` | `lightbox-next-trigger` |
| `LightboxPositioner` | `—` | `—` | `lightbox-positioner` |
| `LightboxPrevTrigger` | `lightbox` | `prev-trigger` | `lightbox-prev-trigger` |
| `LightboxThumbnails` | `lightbox` | `thumbnails` | `lightbox-thumbnails` |
| `LightboxTitle` | `—` | `—` | `lightbox-title` |
| `LightboxTrigger` | `—` | `—` | `lightbox-trigger` |
| `LightboxViewport` | `lightbox` | `viewport` | `lightbox-viewport` |
| `LightboxZoomTrigger` | `lightbox` | `zoom-trigger` | `lightbox-zoom-trigger` |

Custom properties read by this family’s CSS Module:

- `--moduix-lightbox-content-max-height`
- `--moduix-lightbox-content-max-width`

## Generated ids

- `lightbox:${id}`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		Lightbox,
		LightboxBackdrop,
		LightboxBody,
		LightboxCaption,
		LightboxCloseIcon,
		LightboxContent,
		LightboxCounter,
		LightboxDescription,
		LightboxDownloadTrigger,
		LightboxFooter,
		LightboxGallery,
		LightboxHeader,
		LightboxImage,
		LightboxNextTrigger,
		LightboxPositioner,
		LightboxPrevTrigger,
		LightboxThumbnails,
		LightboxTitle,
		LightboxTrigger,
		LightboxViewport,
		LightboxZoomTrigger,
		type LightboxSource
	} from 'rta-ui';

	const sources: LightboxSource[] = [
		{
			src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
			alt: 'A lake at dusk',
			caption: 'Lake at dusk'
		},
		{
			src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
			alt: 'A mountain trail',
			caption: 'Mountain trail'
		},
		{
			src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
			alt: 'Fog in a forest',
			caption: 'Fog in a forest'
		}
	];

	let index = $state(0);
	let zoom = $state(1);
</script>

<Lightbox {sources} bind:index bind:zoom loop aria-label="Photo gallery">
	<LightboxTrigger>Open gallery</LightboxTrigger>
	<LightboxBackdrop />
	<LightboxPositioner>
		<LightboxContent>
			<LightboxHeader>
				<LightboxTitle>Landscapes</LightboxTitle>
				<LightboxDescription>Arrow keys move between images.</LightboxDescription>
			</LightboxHeader>
			<LightboxBody>
				<LightboxGallery>
					<LightboxPrevTrigger />
					<LightboxViewport>
						<LightboxImage />
					</LightboxViewport>
					<LightboxNextTrigger />
				</LightboxGallery>
				<LightboxThumbnails />
			</LightboxBody>
			<LightboxFooter>
				<LightboxCounter />
				<LightboxCaption />
				<LightboxZoomTrigger />
				<LightboxDownloadTrigger />
			</LightboxFooter>
			<LightboxCloseIcon />
		</LightboxContent>
	</LightboxPositioner>
</Lightbox>
```

## Behaviour covered by tests

- composes the dialog shell and keeps the lightbox hooks on its own parts
- shows the first image with counter, thumbnails and disabled prev
- navigates with the next and prev buttons
- navigates with ArrowLeft and ArrowRight, and stops at the last image
- wraps around when loop is enabled
- jumps to an image from the thumbnails
- scales the image with the zoom trigger and resets it
- offers the current image for download
- closes on Escape and restores focus to the trigger

## Notes

- **Parity:** accepted deviation — Upstream relies on the carousel for navigation chrome; here the gallery navigation, thumbnails and zoom are public parts of the lightbox itself.
  Extra slots: `lightbox-caption`, `lightbox-counter`, `lightbox-download-trigger`, `lightbox-next-trigger`, `lightbox-prev-trigger`, `lightbox-thumbnail`, `lightbox-thumbnail-item`, `lightbox-thumbnails`, `lightbox-viewport`, `lightbox-zoom-trigger`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
