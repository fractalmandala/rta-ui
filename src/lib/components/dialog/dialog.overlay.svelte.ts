import { createContext } from '../../internal/context';
import type { DialogPortalTarget } from './dialog.state.svelte';

export interface DialogOverlayConfig {
	portalled: () => boolean;
	portalRef: () => DialogPortalTarget | undefined;
}

const fallback: DialogOverlayConfig = { portalled: () => true, portalRef: () => undefined };

const overlayContext = createContext<DialogOverlayConfig>('DialogOverlay', 'Dialog.Root');

export const setDialogOverlayContext = (config: DialogOverlayConfig) =>
	overlayContext.set(config);

export const useDialogOverlayContext = () => overlayContext.use() ?? fallback;
