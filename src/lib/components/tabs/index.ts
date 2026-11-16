export { default as Tabs } from './Tabs.svelte';
export { default as TabsContent } from './TabsContent.svelte';
export { default as TabsIndicator } from './TabsIndicator.svelte';
export { default as TabsList } from './TabsList.svelte';
export { default as TabsRootProvider } from './TabsRootProvider.svelte';
export { default as TabsTrigger } from './TabsTrigger.svelte';

export { createTabs, useTabsContext, setTabsContext } from './tabs.state.svelte';

export type {
	TabsApi,
	TabsFocusChangeDetails,
	TabsRect,
	TabsValueChangeDetails,
	UseTabsProps
} from './tabs.state.svelte';
export type { TabsContentProps } from './TabsContent.svelte';
export type { TabsIndicatorProps } from './TabsIndicator.svelte';
export type { TabsListProps } from './TabsList.svelte';
export type { TabsRootProps, TabsSize, TabsVariant } from './Tabs.svelte';
export type { TabsRootProviderProps } from './TabsRootProvider.svelte';
export type { TabsTriggerProps } from './TabsTrigger.svelte';
