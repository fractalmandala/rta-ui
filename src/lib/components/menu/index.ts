export { default as Menu } from './Menu.svelte';
export { default as MenuArrow } from './MenuArrow.svelte';
export { default as MenuArrowTip } from './MenuArrowTip.svelte';
export { default as MenuCheckboxItem } from './MenuCheckboxItem.svelte';
export { default as MenuContent } from './MenuContent.svelte';
export { default as MenuContextTrigger } from './MenuContextTrigger.svelte';
export { default as MenuIndicator } from './MenuIndicator.svelte';
export { default as MenuItem } from './MenuItem.svelte';
export { default as MenuItemGroup } from './MenuItemGroup.svelte';
export { default as MenuItemGroupLabel } from './MenuItemGroupLabel.svelte';
export { default as MenuItemIndicator } from './MenuItemIndicator.svelte';
export { default as MenuItemShortcut } from './MenuItemShortcut.svelte';
export { default as MenuItemText } from './MenuItemText.svelte';
export { default as MenuPositioner } from './MenuPositioner.svelte';
export { default as MenuRadioItem } from './MenuRadioItem.svelte';
export { default as MenuRadioItemGroup } from './MenuRadioItemGroup.svelte';
export { default as MenuRootProvider } from './MenuRootProvider.svelte';
export { default as MenuSeparator } from './MenuSeparator.svelte';
export { default as MenuTrigger } from './MenuTrigger.svelte';
export { default as MenuTriggerItem } from './MenuTriggerItem.svelte';
export { default as MenuTriggerItemIcon } from './MenuTriggerItemIcon.svelte';
export { default as MenuViewport } from './MenuViewport.svelte';

export {
	createMenu,
	setMenuContext,
	setMenuItemContext,
	setMenuItemGroupContext,
	setMenuItemPropsContext,
	setMenuTriggerItemContext,
	useMenuContext,
	useMenuItemContext,
	useMenuItemGroupContext,
	useMenuItemPropsContext,
	useOptionalMenuContext,
	useMenuTriggerItemContext
} from './menu.state.svelte';
export { setMenuPortal, useMenuPortal } from './menu.portal.svelte';

export type { MenuPortalOptions, MenuPortalRef } from './menu.portal.svelte';
export type {
	MenuApi,
	MenuFocusOutsideEvent,
	MenuHighlightChangeDetails,
	MenuInteractOutsideEvent,
	MenuItemData,
	MenuItemGroupApi,
	MenuItemPropsApi,
	MenuItemState,
	MenuModifierKeys,
	MenuNavigateDetails,
	MenuOpenChangeDetails,
	MenuOptionItemData,
	MenuOptionItemState,
	MenuPointerDownOutsideEvent,
	MenuPoint,
	MenuSelectionDetails,
	MenuTriggerValueChangeDetails,
	MenuValueChangeDetails,
	UseMenuProps
} from './menu.state.svelte';
export type { MenuRootProps } from './Menu.svelte';
export type { MenuRootProviderProps } from './MenuRootProvider.svelte';
export type { MenuArrowProps } from './MenuArrow.svelte';
export type { MenuArrowTipProps } from './MenuArrowTip.svelte';
export type { MenuContentProps } from './MenuContent.svelte';
export type { MenuContextTriggerProps } from './MenuContextTrigger.svelte';
export type { MenuIndicatorProps } from './MenuIndicator.svelte';
export type { MenuItemProps, MenuItemTone } from './MenuItem.svelte';
export type { MenuItemGroupProps } from './MenuItemGroup.svelte';
export type { MenuItemGroupLabelProps } from './MenuItemGroupLabel.svelte';
export type { MenuItemIndicatorProps } from './MenuItemIndicator.svelte';
export type { MenuItemShortcutProps } from './MenuItemShortcut.svelte';
export type { MenuItemTextProps } from './MenuItemText.svelte';
export type { MenuPositionerProps } from './MenuPositioner.svelte';
export type { MenuRadioItemProps } from './MenuRadioItem.svelte';
export type { MenuRadioItemGroupProps } from './MenuRadioItemGroup.svelte';
export type { MenuSeparatorProps } from './MenuSeparator.svelte';
export type { MenuTriggerProps } from './MenuTrigger.svelte';
export type { MenuTriggerItemProps } from './MenuTriggerItem.svelte';
export type { MenuTriggerItemIconProps } from './MenuTriggerItemIcon.svelte';
export type { MenuViewportProps } from './MenuViewport.svelte';
export type { MenuCheckboxItemProps, MenuIndicatorPosition } from './MenuCheckboxItem.svelte';

import type { MenuApi, MenuItemState } from './menu.state.svelte';

/** Props of this repo's context-provider equivalents for Ark's `Menu.Context` / `Menu.ItemContext`. */
export interface MenuContextProps {
	value: MenuApi;
}

export interface MenuItemContextProps {
	value: MenuItemState;
}

export type UseMenuContext = () => MenuApi;
export type UseMenuItemContext = () => MenuItemState;
export interface UseMenuReturn {
	api: MenuApi;
}
