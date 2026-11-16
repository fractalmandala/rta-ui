import { createContext } from '../../internal/context';
import type { DrawerPortalTarget } from './drawer.state.svelte';

export interface DrawerOverlayConfig {
	portalled: () => boolean;
	portalRef: () => DrawerPortalTarget | undefined;
}

const fallback: DrawerOverlayConfig = { portalled: () => true, portalRef: () => undefined };

const overlayContext = createContext<DrawerOverlayConfig>('DrawerOverlay', 'Drawer.Root');

export const setDrawerOverlayContext = (config: DrawerOverlayConfig) =>
	overlayContext.set(config);

export const useDrawerOverlayContext = () => overlayContext.use() ?? fallback;
