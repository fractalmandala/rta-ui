export { default as Lightbox } from './Lightbox.svelte';
export { default as LightboxBackdrop } from './LightboxBackdrop.svelte';
export { default as LightboxBind } from './LightboxBind.svelte';
export { default as LightboxBody } from './LightboxBody.svelte';
export { default as LightboxCaption } from './LightboxCaption.svelte';
export { default as LightboxCloseIcon } from './LightboxCloseIcon.svelte';
export { default as LightboxCloseTrigger } from './LightboxCloseTrigger.svelte';
export { default as LightboxContent } from './LightboxContent.svelte';
export { default as LightboxCounter } from './LightboxCounter.svelte';
export { default as LightboxDescription } from './LightboxDescription.svelte';
export { default as LightboxDownloadTrigger } from './LightboxDownloadTrigger.svelte';
export { default as LightboxFooter } from './LightboxFooter.svelte';
export { default as LightboxGallery } from './LightboxGallery.svelte';
export { default as LightboxHeader } from './LightboxHeader.svelte';
export { default as LightboxImage } from './LightboxImage.svelte';
export { default as LightboxNextTrigger } from './LightboxNextTrigger.svelte';
export { default as LightboxPositioner } from './LightboxPositioner.svelte';
export { default as LightboxPrevTrigger } from './LightboxPrevTrigger.svelte';
export { default as LightboxRootProvider } from './LightboxRootProvider.svelte';
export { default as LightboxThumbnails } from './LightboxThumbnails.svelte';
export { default as LightboxTitle } from './LightboxTitle.svelte';
export { default as LightboxTrigger } from './LightboxTrigger.svelte';
export { default as LightboxViewport } from './LightboxViewport.svelte';
export { default as LightboxZoomTrigger } from './LightboxZoomTrigger.svelte';

export {
	createLightbox,
	setLightboxContext,
	useLightboxContext
} from './lightbox.state.svelte';

// moduix re-exports Ark's dialog hooks here; this repo's dialog context is the substitute.
export { useDialogContext as useLightboxDialogContext } from '../dialog/dialog.state.svelte';

export { resolveImage, resolveRootNode } from './lightbox';

export type {
	LightboxApi,
	LightboxElementIds,
	LightboxIndexChangeDetails,
	LightboxSource,
	LightboxTranslations,
	LightboxZoomChangeDetails,
	UseLightboxProps
} from './lightbox.state.svelte';
export type { LightboxBindProps, LightboxImageSelectDetails } from './lightbox';
export type { LightboxRootProps } from './Lightbox.svelte';
export type { LightboxRootProviderProps } from './LightboxRootProvider.svelte';
export type { LightboxBackdropProps } from './LightboxBackdrop.svelte';
export type { LightboxBodyProps } from './LightboxBody.svelte';
export type { LightboxCaptionProps } from './LightboxCaption.svelte';
export type { LightboxCloseIconProps } from './LightboxCloseIcon.svelte';
export type { LightboxCloseTriggerProps } from './LightboxCloseTrigger.svelte';
export type { LightboxContentProps } from './LightboxContent.svelte';
export type { LightboxCounterProps } from './LightboxCounter.svelte';
export type { LightboxDescriptionProps } from './LightboxDescription.svelte';
export type { LightboxDownloadTriggerProps } from './LightboxDownloadTrigger.svelte';
export type { LightboxFooterProps } from './LightboxFooter.svelte';
export type { LightboxGalleryProps } from './LightboxGallery.svelte';
export type { LightboxHeaderProps } from './LightboxHeader.svelte';
export type { LightboxImageProps } from './LightboxImage.svelte';
export type { LightboxNextTriggerProps } from './LightboxNextTrigger.svelte';
export type { LightboxPositionerProps } from './LightboxPositioner.svelte';
export type { LightboxPrevTriggerProps } from './LightboxPrevTrigger.svelte';
export type { LightboxThumbnailsProps } from './LightboxThumbnails.svelte';
export type { LightboxTitleProps } from './LightboxTitle.svelte';
export type { LightboxTriggerProps } from './LightboxTrigger.svelte';
export type { LightboxViewportProps } from './LightboxViewport.svelte';
export type { LightboxZoomMode, LightboxZoomTriggerProps } from './LightboxZoomTrigger.svelte';

import type { DialogApi } from '../dialog/dialog.state.svelte';

/** Props of this repo's context-provider equivalent for Ark's `Dialog.Context`. */
export interface LightboxContextProps {
	value: DialogApi;
}

export type UseLightboxContext = () => DialogApi;
export interface UseLightboxReturn {
	api: DialogApi;
}
