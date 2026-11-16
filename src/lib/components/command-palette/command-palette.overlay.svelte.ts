import { createContext } from '../../internal/context';
import type { CommandPalettePortalTarget } from './command-palette.state.svelte';

export interface CommandPaletteOverlayConfig {
	portalled: () => boolean;
	portalRef: () => CommandPalettePortalTarget | undefined;
}

const fallback: CommandPaletteOverlayConfig = { portalled: () => true, portalRef: () => undefined };

const overlayContext = createContext<CommandPaletteOverlayConfig>(
	'CommandPaletteOverlay',
	'CommandPalette'
);

export const setCommandPaletteOverlayContext = (config: CommandPaletteOverlayConfig) =>
	overlayContext.set(config);

export const useCommandPaletteOverlayContext = () => overlayContext.use() ?? fallback;
