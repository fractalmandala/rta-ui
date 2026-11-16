export { default as Timer } from './Timer.svelte';
export { default as TimerActionTrigger } from './TimerActionTrigger.svelte';
export { default as TimerArea } from './TimerArea.svelte';
export { default as TimerControl } from './TimerControl.svelte';
export { default as TimerItem } from './TimerItem.svelte';
export { default as TimerRootProvider } from './TimerRootProvider.svelte';
export { default as TimerSegments } from './TimerSegments.svelte';
export { default as TimerSeparator } from './TimerSeparator.svelte';
export { createTimer, parseTime, setTimerContext, useTimerContext } from './timer.state.svelte';

export type {
	TimerAction,
	TimerApi,
	TimerFormattedTime,
	TimerTickDetails,
	TimerTime,
	TimerTimePart,
	TimerTimeSegment,
	TimerTranslations,
	UseTimerProps
} from './timer.state.svelte';
export type { TimerRootProps } from './Timer.svelte';
export type { TimerActionTriggerProps } from './TimerActionTrigger.svelte';
export type { TimerAreaProps } from './TimerArea.svelte';
export type { TimerControlProps } from './TimerControl.svelte';
export type { TimerItemProps } from './TimerItem.svelte';
export type { TimerRootProviderProps } from './TimerRootProvider.svelte';
export type { TimerSegmentsProps } from './TimerSegments.svelte';
export type { TimerSeparatorProps } from './TimerSeparator.svelte';
