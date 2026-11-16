export { default as Clipboard } from './Clipboard.svelte';
export { default as ClipboardControl } from './ClipboardControl.svelte';
export { default as ClipboardIndicator } from './ClipboardIndicator.svelte';
export { default as ClipboardInput } from './ClipboardInput.svelte';
export { default as ClipboardLabel } from './ClipboardLabel.svelte';
export { default as ClipboardRootProvider } from './ClipboardRootProvider.svelte';
export { default as ClipboardTrigger } from './ClipboardTrigger.svelte';
export { default as ClipboardValueText } from './ClipboardValueText.svelte';
export { createClipboard, setClipboardContext, useClipboardContext } from './clipboard.state.svelte';

export type {
	ClipboardApi,
	ClipboardCopyStatusDetails,
	ClipboardValueChangeDetails,
	UseClipboardProps
} from './clipboard.state.svelte';
export type { ClipboardRootProps } from './Clipboard.svelte';
export type { ClipboardControlProps } from './ClipboardControl.svelte';
export type { ClipboardIndicatorProps } from './ClipboardIndicator.svelte';
export type { ClipboardInputProps } from './ClipboardInput.svelte';
export type { ClipboardLabelProps } from './ClipboardLabel.svelte';
export type { ClipboardRootProviderProps } from './ClipboardRootProvider.svelte';
export type { ClipboardTriggerProps } from './ClipboardTrigger.svelte';
export type { ClipboardValueTextProps } from './ClipboardValueText.svelte';
