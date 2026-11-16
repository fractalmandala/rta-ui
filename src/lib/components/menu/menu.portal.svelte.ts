// The menu's own overlay-portal context. moduix gets this from its shared `overlayPortal` module;
// rta-ui's `internal/` is shared with other families, so the context lives with the family.

import { createContext } from '../../internal/context';

export type MenuPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

// `portalRef` is deliberately not repeated here: it already lives on `UseMenuProps`, and declaring
// it twice made `MenuRootProps` unable to extend both.
export interface MenuPortalOptions {
	portalled?: boolean;
}

export interface MenuPortalApi {
	portalled: () => boolean;
	portalRef: () => MenuPortalRef | undefined;
}

const menuPortalContext = createContext<MenuPortalApi>('MenuPortal', 'Menu.Root');

const fallback: MenuPortalApi = {
	portalled: () => true,
	portalRef: () => undefined
};

export const useMenuPortal = () => menuPortalContext.use() ?? fallback;

export const setMenuPortal = (options: {
	portalled?: () => boolean | undefined;
	portalRef?: () => MenuPortalRef | undefined;
}) =>
	menuPortalContext.set({
		portalled: () => options.portalled?.() ?? true,
		portalRef: () => options.portalRef?.()
	});

export function resolvePortalTarget(ref: MenuPortalRef | undefined): Element | null {
	const value = typeof ref === 'function' ? ref() : ref;
	return value ?? null;
}
